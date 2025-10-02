# Atlas Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER DEVICE                              │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Next.js 14 PWA (Vercel)                     │  │
│  │                                                           │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │  │
│  │  │ Auth Pages  │  │  Onboarding  │  │   Dashboard   │  │  │
│  │  │ - Login     │  │  - TDEE Calc │  │  - Macros     │  │  │
│  │  │ - Signup    │  │  - Goal Setup│  │  - Tracking   │  │  │
│  │  └─────────────┘  └──────────────┘  └───────────────┘  │  │
│  │                                                           │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │           AI Coach Chat Interface                 │   │  │
│  │  │  - Message history                                │   │  │
│  │  │  - Context-aware responses                        │   │  │
│  │  │  - Source citations                               │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  └───────────────────────────┬───────────────────────────── │  │
│                               │                               │
│                               │ Firebase SDK                  │
│                               ↓                               │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │
        ┌───────────────────────┼────────────────────────┐
        │                       │                        │
        ↓                       ↓                        ↓
┌───────────────┐      ┌─────────────────┐     ┌──────────────────┐
│ Firebase Auth │      │ Cloud Firestore │     │ Cloud Functions  │
│               │      │                 │     │                  │
│ - Email/Pass  │      │ Users           │     │ calculatePlan    │
│ - Google      │      │ ├─ profile      │     │ weeklyCheckIn    │
│ - Protected   │      │ ├─ goals        │     │ queryAiCoach     │
│   Routes      │      │ ├─ checkIns     │     │ uploadPdf        │
└───────────────┘      │ ├─ foodLogs     │     └────────┬─────────┘
                       │ └─ chatHistory   │              │
                       │                  │              │
                       │ Security Rules:  │              │
                       │ User-level       │              │
                       │ isolation        │              │
                       └──────────────────┘              │
                                                         │
                        ┌────────────────────────────────┤
                        │                                │
                        ↓                                ↓
            ┌───────────────────────┐        ┌──────────────────┐
            │   Google Gemini AI    │        │    Pinecone      │
            │                       │        │  Vector Database │
            │ ┌──────────────────┐ │        │                  │
            │ │ Gemini 1.5 Pro   │ │        │ Index:           │
            │ │ - Chat responses │ │        │ atlas-fitness-   │
            │ │ - Context-aware  │ │        │ knowledge        │
            │ │ - Personalized   │ │        │                  │
            │ └──────────────────┘ │        │ Dimensions: 768  │
            │                       │        │ Metric: cosine   │
            │ ┌──────────────────┐ │        │                  │
            │ │ text-embedding-  │ │        │ Namespaces:      │
            │ │ 004              │ │←──────→│ - fitness-       │
            │ │ - 768 dimensions │ │        │   nutrition      │
            │ │ - Query/doc      │ │        │                  │
            │ │   embeddings     │ │        │ Metadata:        │
            │ └──────────────────┘ │        │ - text           │
            │                       │        │ - source         │
            │ Free Tier:            │        │ - category       │
            │ - 1500 req/day        │        │ - chunkIndex     │
            │ - 15 req/min          │        └──────────────────┘
            └───────────────────────┘
```

## Data Flow Diagrams

### 1. User Onboarding Flow

```
User Input
  ↓
┌─────────────────────────────────────┐
│ Age, Sex, Weight, BF%, Goal, Diet  │
│ History, Activity Level             │
└────────────────┬────────────────────┘
                 ↓
         [calculatePlan]
         Cloud Function
                 ↓
    ┌────────────────────────┐
    │ Müller BMR Calculation │
    │ - LBM, FM split        │
    │ - BMR formula          │
    └────────┬───────────────┘
             ↓
    ┌────────────────────────────┐
    │ Metabolic Adaptation       │
    │ - Low: 0%                  │
    │ - Medium: 5%               │
    │ - High: 10%                │
    │ - Perpetual: 20%           │
    └────────┬───────────────────┘
             ↓
    ┌────────────────────────────┐
    │ TDEE Calculation           │
    │ TDEE = Adjusted BMR × AF   │
    └────────┬───────────────────┘
             ↓
    ┌────────────────────────────┐
    │ Target Calories            │
    │ - Fat Loss: TDEE × 0.90    │
    │ - Reverse: TDEE            │
    │ - Maintenance: TDEE        │
    └────────┬───────────────────┘
             ↓
    ┌────────────────────────────┐
    │ Macro Allocation           │
    │ 1. Protein (2.6g/kg LBM)   │
    │ 2. Fat (min 20% cals)      │
    │ 3. Carbs (remaining)       │
    └────────┬───────────────────┘
             ↓
    ┌────────────────────────────┐
    │ Return Plan to User        │
    │ - Display macros           │
    │ - Save to Firestore        │
    └────────────────────────────┘
```

### 2. RAG Query Flow (AI Coach)

```
User Question: "What exercises target lats?"
  ↓
┌─────────────────────────────────────┐
│ 1. Embed Query                      │
│ Gemini text-embedding-004           │
│ → 768-dimensional vector            │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│ 2. Vector Search                    │
│ Pinecone similarity search          │
│ - Query vector vs knowledge base    │
│ - Return top 5 chunks (cosine sim)  │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│ 3. Retrieve Context                 │
│ Extract text from matches:          │
│ - "Lat pulldowns target..."         │
│ - "Pull-ups primarily work..."      │
│ - "Rows effectively engage..."      │
│ Sources: fitness-training-guide.pdf │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│ 4. Build Prompt                     │
│ System: You are a fitness expert... │
│ Context: [Retrieved chunks]         │
│ User Profile: Weight 80kg, Goal...  │
│ Question: "What exercises..."       │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│ 5. Generate Response                │
│ Gemini 1.5 Pro                      │
│ - Reads all context                 │
│ - Personalizes to user              │
│ - Grounds in sources                │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│ 6. Return to User                   │
│ Response: "Based on your profile... │
│ The best lat exercises are:         │
│ 1. Pull-ups (3-4 sets)              │
│ 2. Lat pulldowns (3 sets)           │
│ 3. Barbell rows (3 sets)..."        │
│                                     │
│ Sources: [fitness-training-guide]   │
└─────────────────────────────────────┘
  ↓
Save to chat history in Firestore
```

### 3. Weekly Check-in Flow

```
Check-in Trigger (Day 7)
  ↓
┌─────────────────────────────────────┐
│ Fetch Last 14 Days of Weight Data  │
│ - Week 1: Days 1-7                  │
│ - Week 2: Days 8-14                 │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│ Calculate Averages                  │
│ - Week 1 avg: 82.3kg                │
│ - Week 2 avg: 81.8kg                │
│ - Change: -0.5kg (-0.61%)           │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│ Decision Logic                      │
│                                     │
│ IF Fat Loss Goal:                   │
│   IF plateau (< 0.1kg change):      │
│     → Reduce 125 kcal               │
│   ELSE IF good progress:            │
│     → Continue current plan         │
│                                     │
│ IF Reverse Diet Goal:               │
│   IF gain ≤ 0.2% body weight:       │
│     → Increase 2% calories          │
│   ELSE IF gain > 0.2%:              │
│     → Hold steady                   │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│ Generate New Macros (if adjusting)  │
│ Old: 2200 kcal (165p/245c/73f)      │
│ New: 2075 kcal (165p/220c/66f)      │
│ - Protein unchanged                 │
│ - Reduce carbs: -25g                │
│ - Reduce fats: -7g                  │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│ Update Firestore                    │
│ users/{uid}/goals/{goalId}          │
│   .activePlan = newMacros            │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│ Display to User                     │
│ "Plateau detected. Reducing         │
│  calories by 125. New targets:"     │
│  → 2075 kcal                        │
│  → 165g protein                     │
│  → 220g carbs                       │
│  → 66g fats                         │
└─────────────────────────────────────┘
```

### 4. PDF Knowledge Upload Flow

```
Admin uploads PDF
  ↓
┌─────────────────────────────────────┐
│ 1. Upload to Firebase Storage       │
│ pdfs/fitness-training-guide.pdf     │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│ 2. Trigger Processing Function      │
│ uploadKnowledgePdf                  │
│ - pdfUrl, fileName, category        │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│ 3. Extract Text                     │
│ pdf-parse library                   │
│ → Raw text string                   │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│ 4. Split into Chunks                │
│ LangChain RecursiveCharacterSplitter│
│ - Size: 1000 chars                  │
│ - Overlap: 200 chars                │
│ → 50 chunks                         │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│ 5. Generate Embeddings              │
│ For each chunk:                     │
│   Gemini text-embedding-004         │
│   → 768-dim vector                  │
│                                     │
│ Batch size: 5 chunks                │
│ Rate limit buffer: 1s between       │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│ 6. Store in Pinecone                │
│ Upsert to atlas-fitness-knowledge   │
│                                     │
│ Vector {                            │
│   id: "fitness-guide-chunk-0",      │
│   values: [0.23, -0.45, ...],       │
│   metadata: {                       │
│     text: "Lat exercises...",       │
│     source: "fitness-guide.pdf",    │
│     category: "fitness",            │
│     chunkIndex: 0                   │
│   }                                 │
│ }                                   │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│ 7. Return Success                   │
│ {                                   │
│   success: true,                    │
│   chunksProcessed: 50,              │
│   vectorsUploaded: 50               │
│ }                                   │
└─────────────────────────────────────┘
```

## Technology Stack

### Frontend Layer
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript 5.4
- **Styling**: TailwindCSS 3.4
- **Components**: Radix UI
- **State**: Zustand + react-firebase-hooks
- **Build**: SWC
- **Deployment**: Vercel

### Backend Layer
- **Functions**: Firebase Cloud Functions v2 (Node 20)
- **Database**: Cloud Firestore (NoSQL)
- **Auth**: Firebase Authentication
- **Storage**: Firebase Storage (for PDFs)
- **Runtime**: Serverless

### AI Layer
- **LLM**: Google Gemini 1.5 Pro
- **Embeddings**: text-embedding-004 (768-dim)
- **Vector DB**: Pinecone (cosine similarity)
- **Text Processing**: LangChain

### DevOps Layer
- **VCS**: Git + GitHub
- **CI/CD**: Vercel (frontend), Firebase CLI (backend)
- **Monitoring**: Cloud Logging, Vercel Analytics
- **Emulators**: Firebase Emulator Suite

## Security Model

### Authentication
```
User → Firebase Auth → ID Token → Verified by:
  ├─ Frontend: Firebase client SDK
  ├─ Firestore: Security Rules
  └─ Functions: Admin SDK verification
```

### Authorization (Firestore Rules)
```
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;

  match /goals/{goalId} {
    allow read, write: if request.auth.uid == userId;
  }

  match /dailyCheckIns/{checkInId} {
    allow read, write: if request.auth.uid == userId;
  }
}
```

### Data Flow Security
```
Client Request
  ↓
[Firebase Auth] ← Verify ID token
  ↓
[Firestore Rules] ← Check user owns data
  ↓
[Cloud Function] ← Additional validation
  ↓
[External API] ← Rate limiting
  ↓
Response
```

## Scalability Considerations

### Current Limits (Free Tier)
- **Gemini**: 1500 requests/day, 15/min
- **Pinecone**: 1M vectors, 1 index
- **Firestore**: 50K reads/day, 20K writes/day
- **Functions**: 2M invocations/month
- **Vercel**: 100GB bandwidth/month

### Scaling Strategy
1. **Gemini**: Upgrade to paid tier ($$$)
2. **Pinecone**: Upgrade to Standard/Enterprise
3. **Firestore**: Auto-scales (pay per use)
4. **Functions**: Auto-scales (pay per use)
5. **Vercel**: Upgrade to Pro ($20/mo)

### Optimization Points
- Cache common RAG queries
- Batch Firestore operations
- Use Gemini Flash for simple queries
- Implement client-side rate limiting
- CDN for static assets
- Lazy load components

---

This architecture is designed to be:
- ✅ **Scalable**: Serverless, auto-scaling
- ✅ **Secure**: User-level isolation, auth required
- ✅ **Cost-effective**: Generous free tiers
- ✅ **Maintainable**: Clear separation of concerns
- ✅ **Fast**: Edge deployment, efficient queries
