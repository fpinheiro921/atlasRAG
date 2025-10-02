# Getting Started with Atlas

This is your step-by-step guide to get Atlas up and running.

## Prerequisites Checklist

Before you begin, make sure you have:

- [ ] **Node.js 20+** installed (`node --version`)
- [ ] **npm** or **yarn** installed
- [ ] **Firebase CLI** installed (`npm install -g firebase-tools`)
- [ ] **Google Cloud account** (same as Firebase account)
- [ ] **Git** installed (for version control)

## Step 1: Clone and Install (5 minutes)

```bash
# Already in the project directory!
cd "g:\WEB APPS\atlas_RAG"

# Install all dependencies (root, web, functions)
npm run install:all
```

**Expected output**: Successfully installed dependencies in 3 locations

## Step 2: Firebase Setup (10 minutes)

### 2.1 Login to Firebase

```bash
firebase login
```

**What this does**: Authenticates your Firebase CLI with your Google account

### 2.2 Create/Select Firebase Project

```bash
# Initialize Firebase in this directory
firebase init

# Select:
# - Firestore
# - Functions
# - Emulators

# Or if you already have a project:
firebase use --add
```

**What to choose**:
- Use existing project? → Yes (if you have one)
- Select project from list
- Give it an alias: `default` or `prod`

### 2.3 Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click gear icon → Project Settings
4. Scroll to "Your apps" section
5. Click </> (Web) icon to add a web app
6. Register app name: "Atlas Web"
7. Copy the configuration object

## Step 3: Environment Variables (5 minutes)

### 3.1 Web App Configuration

Create `web/.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Use emulators in development
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
```

**Where to get values**: From Firebase Console → Project Settings (step 2.3)

### 3.2 Cloud Functions Configuration

Create `functions/.env`:

```env
# Get from https://aistudio.google.com/app/apikey
GOOGLE_API_KEY=AIza...

# Project ID is automatically set in Cloud Functions
# No need to add it manually!
```

**Where to get GOOGLE_API_KEY**:
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key

## Step 4: Enable Required APIs (5 minutes)

```bash
# Login to gcloud (if not already)
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Enable Vertex AI API (required for RAG Engine)
gcloud services enable aiplatform.googleapis.com

# Enable Cloud Storage API
gcloud services enable storage-api.googleapis.com

# Verify APIs are enabled
gcloud services list --enabled | grep -E "aiplatform|storage"
```

**Expected output**: You should see both APIs listed

## Step 5: Deploy Backend (10 minutes)

### 5.1 Deploy Firestore Rules and Indexes

```bash
# Deploy security rules
firebase deploy --only firestore:rules

# Deploy indexes
firebase deploy --only firestore:indexes
```

**Expected output**:
```
✔ Deploy complete!
```

### 5.2 Build and Deploy Cloud Functions

```bash
# Navigate to functions directory
cd functions

# Build TypeScript
npm run build

# Deploy to Firebase
cd ..
firebase deploy --only functions
```

**Expected output**:
```
✔ functions: Finished running predeploy script.
✔ functions[calculatePlan]: Successful create operation.
✔ functions[processWeeklyCheckIn]: Successful create operation.
✔ functions[queryAiCoach]: Successful create operation.
✔ functions[uploadKnowledgePdf]: Successful create operation.
```

**Note**: First deployment may take 5-10 minutes

## Step 6: Test Locally (5 minutes)

### 6.1 Start Firebase Emulators

Open **Terminal 1**:

```bash
npm run dev:emulators
```

**Expected output**:
```
✔  All emulators ready! It is now safe to connect your app.
┌─────────────────────────────────────────────────────────────┐
│ ✔  All emulators ready! It is now safe to connect your app.│
│ i  View Emulator UI at http://localhost:4000               │
└─────────────────────────────────────────────────────────────┘

Emulator Hub running at localhost:4400
Other reserved ports: 4500

Issues? Report them at https://github.com/firebase/firebase-tools/issues
```

**Keep this terminal open!**

### 6.2 Start Next.js Development Server

Open **Terminal 2**:

```bash
npm run dev
```

**Expected output**:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### 6.3 Test the App

1. Open browser: http://localhost:3000
2. You should see the Atlas landing page
3. Open Emulator UI: http://localhost:4000
4. Check that services are running

**Success!** 🎉 Your development environment is working!

## Step 7: Deploy Frontend to Vercel (10 minutes)

### Option A: Via Vercel Dashboard (Recommended)

1. Go to [Vercel](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your Git repository
5. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

6. Add Environment Variables (from web/.env.local):
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   NEXT_PUBLIC_FIREBASE_PROJECT_ID
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   NEXT_PUBLIC_FIREBASE_APP_ID
   NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false
   ```

7. Click "Deploy"

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd web
vercel

# Follow prompts
# - Setup and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? atlas-rag
# - Directory? ./
# - Override settings? No
```

**Expected output**:
```
✔ Deployed to production. Run `vercel --prod` to overwrite later.
```

## Step 8: Upload Knowledge Base PDFs (15 minutes)

### 8.1 Prepare Your PDFs

Collect fitness and nutrition PDFs:
- Exercise guides
- Nutrition information
- Training methodologies
- Scientific research papers

**Recommended**: Start with 3-5 PDFs to test

### 8.2 Upload to Cloud Storage

**Via Console** (easier):
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project → Storage
3. Create folder: `knowledge-base/fitness/`
4. Upload PDFs

**Via gsutil** (faster for bulk):
```bash
gsutil cp fitness-guide.pdf gs://your-project.appspot.com/knowledge-base/fitness/
gsutil cp nutrition-basics.pdf gs://your-project.appspot.com/knowledge-base/nutrition/
```

### 8.3 Import to Vertex AI RAG Corpus

Get your admin ID token:
```bash
# In browser console on your deployed app (after signing in):
firebase.auth().currentUser.getIdToken().then(console.log)
```

Import PDFs:
```bash
# Replace with your function URL and token
curl -X POST https://us-central1-your-project.cloudfunctions.net/uploadKnowledgePdf \
  -H "Authorization: Bearer YOUR_ADMIN_ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pdfUrl": "https://example.com/fitness-guide.pdf",
    "fileName": "fitness-guide.pdf",
    "category": "fitness"
  }'
```

**Expected output**:
```json
{
  "success": true,
  "corpusName": "projects/.../locations/.../ragCorpora/..."
}
```

### 8.4 Verify Import

Check Firestore:
1. Go to Firebase Console → Firestore
2. Look for `knowledgeBase` collection
3. Should see documents for each imported PDF

Check Vertex AI:
```bash
gcloud ai rag-corpora list --location=us-central1
```

## Step 9: Test the RAG System (5 minutes)

### 9.1 Test Query Function

```bash
curl -X POST https://us-central1-your-project.cloudfunctions.net/queryAiCoach \
  -H "Authorization: Bearer YOUR_ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What exercises target the latissimus dorsi?",
    "userContext": {
      "weightKg": 80,
      "goalType": "fat_loss"
    }
  }'
```

**Expected output**:
```json
{
  "success": true,
  "result": {
    "response": "Based on the training guide, the best exercises for targeting your lats are...",
    "sources": ["fitness-guide.pdf"]
  }
}
```

### 9.2 Test in Browser

Once you build the chat interface (later), you can test by:
1. Sign in to the app
2. Navigate to chat
3. Ask: "What exercises should I do for lats?"
4. Verify you get a response with sources

## Step 10: Verify Everything Works ✅

Run through this checklist:

### Backend Checks
- [ ] Firestore rules deployed
- [ ] Cloud Functions deployed and running
- [ ] Vertex AI API enabled
- [ ] PDFs imported to RAG corpus
- [ ] Test query returns results

### Frontend Checks
- [ ] Web app deployed to Vercel
- [ ] Can access the deployed URL
- [ ] Environment variables configured
- [ ] Firebase connection working

### Local Development
- [ ] Firebase emulators start successfully
- [ ] Next.js dev server runs
- [ ] Can access http://localhost:3000
- [ ] No console errors

### RAG System
- [ ] PDFs in Cloud Storage
- [ ] RAG corpus created
- [ ] Files imported to corpus
- [ ] Queries return relevant context

**All checked?** You're ready to start building features! 🚀

---

## Common Issues & Solutions

### Issue: "Permission denied" when deploying functions

**Solution**:
```bash
# Ensure you're logged in
firebase login --reauth

# Set the correct project
firebase use your-project-id
```

### Issue: "Vertex AI API not enabled"

**Solution**:
```bash
gcloud services enable aiplatform.googleapis.com
```

### Issue: Environment variables not working in Vercel

**Solution**:
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Ensure all variables are added
3. Make sure they're enabled for Production, Preview, and Development
4. Redeploy: `vercel --prod`

### Issue: Emulators won't start (port in use)

**Solution**:
```bash
# Find and kill processes on Firebase ports
lsof -ti:5001,8080,9099,4000 | xargs kill -9

# Or change ports in firebase.json
```

### Issue: PDF import fails

**Possible causes**:
- PDF is encrypted (unlock it first)
- File too large (>100MB limit)
- Invalid GCS URI format (must be `gs://bucket/path`)

**Solution**: Verify PDF is valid and under 100MB

### Issue: RAG queries return no context

**Possible causes**:
- PDFs not imported yet (check Firestore `knowledgeBase` collection)
- Corpus not created (automatically created on first import)
- Query too specific (try broader questions)

**Solution**:
```bash
# Verify corpus exists
gcloud ai rag-corpora list --location=us-central1

# Check files in corpus
gcloud ai rag-files list --rag-corpus=CORPUS_ID --location=us-central1
```

---

## Next Steps

Now that everything is set up, you can start building features:

1. **Authentication** → [Build login/signup pages]
2. **Onboarding** → [TDEE calculator interface]
3. **Dashboard** → [Main app layout]
4. **Tracking** → [Weight and food logging]
5. **AI Coach** → [Chat interface]

See [PROJECT_STATUS.md](PROJECT_STATUS.md) for detailed implementation roadmap.

---

## Need Help?

- **Vertex AI RAG**: See [VERTEX_AI_RAG.md](VERTEX_AI_RAG.md)
- **Gemini Integration**: See [GEMINI_INTEGRATION.md](GEMINI_INTEGRATION.md)
- **Deployment**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md)

**Happy building!** 🎉
