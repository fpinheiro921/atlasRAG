# Vercel Environment Variables Setup

When deploying to Vercel, you need to add these environment variables in your project settings:

## Required Environment Variables

Go to your Vercel project → Settings → Environment Variables and add:

### Firebase Configuration

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDfiKdMAs4QX1IhSfyZgB23_tv0kVFLJLU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=atlas-6c90e.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=atlas-6c90e
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=atlas-6c90e.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=992370386646
NEXT_PUBLIC_FIREBASE_APP_ID=1:992370386646:web:93750b6172db8d9f01cb77
```

### Development Settings

```
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false
```

## How to Add Variables in Vercel

1. Go to https://vercel.com/dashboard
2. Select your project (atlasRAG)
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - **Key**: Variable name (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`)
   - **Value**: Variable value
   - **Environments**: Select Production, Preview, and Development

## Important Notes

- All `NEXT_PUBLIC_*` variables are exposed to the browser
- After adding variables, redeploy your application for changes to take effect
- Firebase API keys are safe to expose as they're restricted by Firebase Security Rules

## Deployment Command

Once environment variables are set, Vercel will automatically:
1. Install dependencies
2. Build your Next.js app
3. Deploy to production

Your app will be available at: `https://atlas-rag.vercel.app` (or your custom domain)
