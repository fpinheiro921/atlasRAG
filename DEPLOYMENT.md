# Deployment Guide for Atlas

This guide covers deploying Atlas to Vercel (frontend) and Firebase (backend services).

## Architecture Overview

- **Frontend**: Next.js app deployed to Vercel
- **Backend**: Firebase Cloud Functions, Firestore, and Auth
- **AI/RAG**: OpenAI + Pinecone vector database

## Prerequisites

1. Vercel account (free tier works)
2. Firebase project (Blaze plan for Cloud Functions)
3. OpenAI API key
4. Pinecone account

## Part 1: Firebase Backend Setup

### 1.1 Create Firebase Project

1. Go to https://console.firebase.google.com
2. Create a new project or select existing
3. Enable the following services:
   - Authentication (Email/Password provider)
   - Cloud Firestore
   - Cloud Functions
   - Cloud Storage (for PDF uploads)

### 1.2 Upgrade to Blaze Plan

Cloud Functions requires the Blaze (pay-as-you-go) plan:
1. Go to Firebase Console > Project Settings > Usage and Billing
2. Upgrade to Blaze plan (free tier included)

### 1.3 Get Firebase Configuration

1. Go to Project Settings > General
2. Scroll to "Your apps" section
3. Click "Add app" > Web (</> icon)
4. Register your app
5. Copy the Firebase configuration object

### 1.4 Deploy Firestore Rules and Indexes

```bash
# From project root
firebase login
firebase use --add  # Select your project

# Deploy rules and indexes
firebase deploy --only firestore
```

### 1.5 Set Environment Variables for Functions

```bash
cd functions

# Set OpenAI API key
firebase functions:config:set openai.api_key="your_openai_api_key"

# Set Pinecone configuration
firebase functions:config:set pinecone.api_key="your_pinecone_api_key"
firebase functions:config:set pinecone.index_name="atlas-fitness-knowledge"

# For local development, download config
firebase functions:config:get > .runtimeconfig.json
```

### 1.6 Deploy Cloud Functions

```bash
# Build and deploy functions
npm run build
firebase deploy --only functions
```

Note the deployed function URLs - you'll need these for monitoring.

## Part 2: Pinecone Setup

### 2.1 Create Pinecone Index

1. Sign up at https://www.pinecone.io
2. Create a new index:
   - Name: `atlas-fitness-knowledge`
   - Dimensions: `1536` (for text-embedding-3-small)
   - Metric: `cosine`
   - Region: Choose closest to your Firebase Functions region

### 2.2 Get API Key

1. Go to API Keys in Pinecone dashboard
2. Copy your API key
3. Add it to Firebase Functions config (see step 1.5)

## Part 3: Vercel Frontend Deployment

### 3.1 Connect Repository to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com
2. Click "New Project"
3. Import your Git repository
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: `web`
   - Build Command: `npm run build`
   - Output Directory: `.next`

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to web directory
cd web

# Deploy
vercel
```

### 3.2 Configure Environment Variables in Vercel

Go to Project Settings > Environment Variables and add:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false
```

**Important**: Add these variables to all environments (Production, Preview, Development)

### 3.3 Deploy

If using Vercel Dashboard, deployments happen automatically on git push.

If using CLI:
```bash
# Production deployment
vercel --prod
```

## Part 4: Post-Deployment Configuration

### 4.1 Configure CORS for Cloud Functions

If you get CORS errors, update your function endpoints to allow Vercel domain:

```typescript
// In functions/src/index.ts
export const someFunction = onRequest(async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', 'https://your-vercel-domain.vercel.app');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // ... rest of function
});
```

### 4.2 Set up Custom Domain (Optional)

#### In Vercel:
1. Go to Project Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions

#### In Firebase (for auth):
1. Go to Authentication > Settings > Authorized Domains
2. Add your Vercel domain and custom domain

### 4.3 Test the Deployment

1. Visit your Vercel URL
2. Create a test account
3. Complete onboarding
4. Test RAG chat functionality
5. Check Firebase Console for function logs

## Part 5: Loading Knowledge Base PDFs

### 5.1 Create Admin User

```bash
# Set custom claims for admin user
firebase auth:export users.json
# Find your user UID
firebase firestore:update users/{your-uid} admin=true

# Or use Firebase Admin SDK
```

### 5.2 Upload PDFs

```bash
# Upload PDF to Firebase Storage
firebase storage:upload fitness-guide.pdf

# Get the download URL
firebase storage:get fitness-guide.pdf --json

# Call the processing function
curl -X POST https://your-region-project.cloudfunctions.net/uploadKnowledgePdf \
  -H "Authorization: Bearer YOUR_ADMIN_ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pdfUrl": "https://storage.googleapis.com/.../fitness-guide.pdf",
    "fileName": "fitness-training-guide.pdf",
    "category": "fitness"
  }'
```

## Monitoring and Maintenance

### Firebase Console

Monitor:
- Function execution logs: https://console.firebase.google.com/project/YOUR_PROJECT/functions/logs
- Firestore usage: Check reads/writes
- Auth users: Track sign-ups

### Vercel Dashboard

Monitor:
- Build logs
- Function logs (if using Vercel functions)
- Analytics
- Performance metrics

### Cost Monitoring

Set up billing alerts:
1. Firebase: Set budget alerts in GCP Console
2. Vercel: Monitor bandwidth usage
3. OpenAI: Set usage limits in OpenAI dashboard
4. Pinecone: Monitor index usage

## Troubleshooting

### Common Issues

#### 1. CORS Errors
- Add Vercel domain to Firebase Auth authorized domains
- Update CORS headers in Cloud Functions

#### 2. Function Timeouts
- Increase timeout in function configuration
- Optimize database queries
- Add indexes to Firestore

#### 3. Environment Variables Not Working
- Verify they're set in Vercel for all environments
- Redeploy after changing environment variables
- Check variable names match exactly (case-sensitive)

#### 4. Firebase Emulator Not Connecting
- Check `NEXT_PUBLIC_USE_FIREBASE_EMULATOR` is set correctly
- Ensure emulator is running before starting dev server
- Check ports are not in use

## Rollback Procedures

### Vercel Rollback
1. Go to Deployments
2. Find previous working deployment
3. Click "Promote to Production"

### Firebase Functions Rollback
```bash
# List previous versions
firebase functions:list

# Delete current version if needed
firebase functions:delete functionName

# Redeploy previous code
git checkout previous-commit
firebase deploy --only functions
```

## Security Checklist

- [ ] Firebase Security Rules deployed and tested
- [ ] All API keys stored as environment variables
- [ ] CORS properly configured
- [ ] HTTPS enforced on all endpoints
- [ ] Auth required for sensitive operations
- [ ] Rate limiting configured
- [ ] Firestore indexes created
- [ ] Admin claims properly set
- [ ] Production/development environments separated

## Next Steps

After successful deployment:
1. Set up monitoring and alerting
2. Configure backup strategies for Firestore
3. Load initial knowledge base PDFs
4. Create user documentation
5. Set up CI/CD for automated deployments
6. Configure custom domain
7. Set up email templates in Firebase Auth
8. Test disaster recovery procedures
