# Atlas - Science-Based Fitness & Nutrition Tracking with AI Coach

A comprehensive Progressive Web App (PWA) for systematic, science-backed nutrition management with an AI-powered fitness and nutrition coach using RAG (Retrieval Augmented Generation).

## Features

### Core Features
- **Onboarding & TDEE Calculation**: Uses the Müller equation for accurate BMR calculation with metabolic adaptation adjustments
- **Daily Tracking**: Weight logging, food tracking, and macro targets
- **Weekly Check-ins**: Automated adjustment engine for fat loss and reverse dieting protocols
- **Progress Visualization**: Charts and trends for weight, macros, and body measurements
- **Goal Management**: Support for fat loss, reverse dieting, and maintenance phases

### AI Coach (RAG System)
- **Knowledge Base**: Upload fitness and nutrition PDFs to create a personalized knowledge base
- **Context-Aware Advice**: AI coach has access to user's current stats and goals
- **Evidence-Based**: Responses grounded in scientific literature stored in the vector database
- **Chat Interface**: Natural language Q&A about training, nutrition, and progress

## Tech Stack

### Frontend
- **Next.js 14** (App Router) - React framework with static export
- **TypeScript 5.4** - Type-safe development
- **TailwindCSS 3.4** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Zustand** - State management

### Backend (Firebase)
- **Firebase Auth** - User authentication
- **Cloud Firestore** - NoSQL database with offline support
- **Cloud Functions v2** - Serverless compute (Node.js 20)

### Hosting
- **Vercel** - Next.js deployment with edge network

### RAG System
- **Google Gemini 1.5 Pro** - LLM for chat responses
- **Google Embeddings** (text-embedding-004) - Document embeddings (768 dimensions)
- **Pinecone** - Vector database for similarity search
- **LangChain** - Text splitting and RAG orchestration

## Project Structure

```
atlas_RAG/
├── web/                    # Next.js frontend
│   ├── app/               # Next.js app router pages
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   └── feature/      # Feature-specific components
│   ├── firebase/         # Firebase client configuration
│   └── lib/              # Utilities and types
├── functions/             # Cloud Functions
│   └── src/
│       ├── calculations.ts   # TDEE & macro calculations
│       ├── rag/             # RAG system
│       │   ├── ragConfig.ts
│       │   ├── embedPdf.ts
│       │   └── queryRag.ts
│       └── index.ts         # Function exports
├── context/               # Product documentation
├── firestore.rules       # Firestore security rules
├── firestore.indexes.json
└── firebase.json         # Firebase configuration
```

## Setup Instructions

### Prerequisites
- Node.js 20+
- npm or yarn
- Firebase CLI: `npm install -g firebase-tools`
- Firebase project (create at https://console.firebase.google.com)
- Google AI Studio API key (for Gemini - get at https://aistudio.google.com/app/apikey)
- Pinecone account (for vector database)

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install all project dependencies (web + functions)
npm run install:all
```

### 2. Firebase Setup

```bash
# Login to Firebase
firebase login

# Initialize Firebase project
firebase use --add

# Select your Firebase project and give it an alias (e.g., 'default', 'prod')
```

### 3. Configure Environment Variables

#### Web App (.env.local)
Create `web/.env.local`:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Development
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true  # Set to false for production
```

#### Cloud Functions (.env)
Create `functions/.env`:

```env
# Google AI Configuration
GOOGLE_API_KEY=your_google_ai_api_key

# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=atlas-fitness-knowledge
```

### 4. Pinecone Setup

1. Create account at https://www.pinecone.io/
2. Create a new index named `atlas-fitness-knowledge`
3. Configure index settings:
   - Dimensions: **768** (for Google text-embedding-004)
   - Metric: cosine
4. Copy API key to functions/.env

### 5. Google AI Studio Setup

1. Go to https://aistudio.google.com/app/apikey
2. Create a new API key or use existing one
3. Copy the API key to `functions/.env` as `GOOGLE_API_KEY`
4. This key provides access to:
   - Gemini 1.5 Pro (text generation)
   - text-embedding-004 (embeddings)

### 6. Deploy Firestore Rules and Indexes

```bash
# Deploy security rules
firebase deploy --only firestore:rules

# Deploy indexes
firebase deploy --only firestore:indexes
```

### 7. Run Locally with Emulators

```bash
# Terminal 1: Start Firebase Emulators
npm run dev:emulators

# Terminal 2: Start Next.js dev server
npm run dev
```

The app will be available at http://localhost:3000

Emulator UI: http://localhost:4000

### 8. Deploy to Production

#### Deploy Frontend to Vercel

1. Install Vercel CLI (optional):
```bash
npm install -g vercel
```

2. Deploy via Vercel CLI:
```bash
cd web
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

3. Configure Environment Variables in Vercel Dashboard:
   - Go to Project Settings > Environment Variables
   - Add all `NEXT_PUBLIC_FIREBASE_*` variables
   - Add `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false`

#### Deploy Firebase Backend

```bash
# Deploy Functions
firebase deploy --only functions

# Deploy Firestore Rules and Indexes
firebase deploy --only firestore
```

## Usage

### Adding Knowledge to the AI Coach

To populate the RAG system with fitness/nutrition knowledge:

1. Prepare PDF documents with scientific content
2. Upload to Firebase Storage or provide accessible URLs
3. Call the admin endpoint to process PDFs:

```bash
curl -X POST https://your-project.cloudfunctions.net/uploadKnowledgePdf \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pdfUrl": "https://storage.googleapis.com/your-bucket/fitness-guide.pdf",
    "fileName": "fitness-training-guide.pdf",
    "category": "fitness"
  }'
```

### Calculation Methodology

#### Fat Loss Phase
- TDEE calculated using Müller equation
- Metabolic adaptation adjustment based on dieting history (5-20% reduction)
- 10% caloric deficit from adjusted TDEE
- Protein: 2.4-2.8g/kg LBM
- Fat minimum: 20% of total calories
- Carbs: Remaining calories

#### Reverse Dieting
- Conservative approach: ≤0.2% body weight gain per week
- 2% calorie increases when weight gain is within threshold
- Protein: 2.0-2.3g/kg LBM
- Gradual metabolic capacity building

## API Reference

### Cloud Functions

#### `calculatePlan`
Calculate personalized nutrition plan during onboarding.

**Input:**
```typescript
{
  age: number;
  sex: "male" | "female";
  bodyWeightKg: number;
  bodyFatPercentage: number;
  goalType: "fat_loss" | "reverse_dieting" | "maintenance";
  dietHistory: "low" | "medium" | "high" | "perpetual";
  activityFactor: number; // 1.2, 1.35, 1.5
}
```

#### `processWeeklyCheckIn`
Analyze weekly progress and suggest adjustments.

#### `queryAiCoach`
Query the RAG system for fitness/nutrition advice.

**Input:**
```typescript
{
  query: string;
  userId: string;
  userContext?: {
    weightKg?: number;
    goalType?: GoalType;
    activePlan?: MacroPlan;
  };
}
```

## Security

- Firestore Security Rules enforce user-level data isolation
- All sensitive operations require authentication
- Admin functions require custom claims
- HTTPS-only communication
- Environment variables for API keys

## Costs Estimation

### Vercel (Hobby - Free Tier)
- 100GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS
- Edge network
- Pro: $20/month for production use

### Firebase (Free Tier)
- Firestore: 1GB storage, 50K reads/day
- Functions: 2M invocations/month
- Auth: Unlimited users

### Google AI (Gemini)
- **Free tier**: 15 requests/minute, 1500 requests/day
- Gemini 1.5 Pro: Free up to rate limits
- text-embedding-004: Free up to rate limits
- **Estimated cost**: $0-10/month for moderate usage (likely stays in free tier)

### Pinecone
- Free tier: 1M vectors, 1 index
- Pro: $70/month for larger scale

## Development

### Running Tests
```bash
cd functions
npm test
```

### Linting
```bash
cd web && npm run lint
cd functions && npm run lint
```

### Firebase Emulators
The emulator suite includes:
- Auth (port 9099)
- Firestore (port 8080)
- Functions (port 5001)
- Hosting (port 5000)
- Emulator UI (port 4000)

## Contributing

This is a private project based on scientific methodologies from:
- Müller et al. (2004) - BMR equation
- Layne Norton's flexible dieting protocols
- Evidence-based fitness and nutrition research

## License

Proprietary - All rights reserved

## Support

For issues or questions, please refer to the context documentation in the `/context` folder.
