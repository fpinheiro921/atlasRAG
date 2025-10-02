# Vertex AI RAG Engine Integration Guide

## Overview

Atlas now uses **Vertex AI RAG Engine** instead of Pinecone for the knowledge base. This is a fully managed RAG solution from Google Cloud that integrates seamlessly with Gemini and Firebase.

## Why Vertex AI RAG Engine?

### ✅ Advantages over Pinecone

1. **Fully Managed**: No separate service to manage
2. **Native Integration**: Built into Google Cloud Platform
3. **Cost Effective**: Pay only for what you use, no minimum fees
4. **Auto-scaling**: Handles traffic spikes automatically
5. **Unified Billing**: Single bill with Firebase/GCP
6. **Better Security**: Uses same IAM as Firebase
7. **PDF Processing Built-in**: Automatic text extraction and chunking
8. **No Dimension Management**: Handles embeddings automatically

### 📊 Cost Comparison

**Pinecone**:
- Free tier: 1M vectors
- Paid: $70/month minimum (Standard plan)

**Vertex AI RAG Engine**:
- Pay per use (no minimum)
- Document ingestion: ~$0.002 per page
- Query: ~$0.02 per 1K queries
- Storage: ~$0.10/GB/month
- **Estimated**: $5-15/month for typical usage

## Architecture

```
PDF Upload
    ↓
[Cloud Storage] (gs://bucket/file.pdf)
    ↓
[Vertex AI RAG Engine]
    ├─ Extract text from PDF
    ├─ Chunk into segments
    ├─ Generate embeddings (automatic)
    ├─ Index for fast retrieval
    └─ Store in RAG Corpus
    ↓
User Query
    ↓
[Vertex AI RAG Engine]
    ├─ Embed query (automatic)
    ├─ Similarity search
    └─ Return relevant contexts
    ↓
[Gemini 1.5 Pro]
    └─ Generate response with context
    ↓
User receives personalized answer
```

## Setup Instructions

### 1. Enable Vertex AI API

```bash
# Enable required APIs
gcloud services enable aiplatform.googleapis.com
gcloud services enable storage-api.googleapis.com

# Or via Firebase Console:
# Go to Google Cloud Console > APIs & Services > Enable APIs
# Search for "Vertex AI API" and enable it
```

### 2. Set Up Permissions

Your Firebase Cloud Functions automatically have access to Vertex AI if they're in the same project. No additional configuration needed!

### 3. Configure Project

The RAG system automatically uses your Firebase project ID. Make sure your Cloud Functions are deployed with proper permissions:

```bash
# Deploy functions (they automatically get Vertex AI access)
firebase deploy --only functions
```

### 4. Upload PDFs to Cloud Storage

```bash
# Upload via gsutil
gsutil cp fitness-guide.pdf gs://your-project.appspot.com/knowledge-base/fitness/

# Or via Firebase Console:
# Go to Storage > Upload File
```

### 5. Import PDFs to RAG Corpus

```bash
# Call the uploadKnowledgePdf function
curl -X POST https://your-region-project.cloudfunctions.net/uploadKnowledgePdf \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pdfUrl": "https://example.com/fitness-guide.pdf",
    "fileName": "fitness-guide.pdf",
    "category": "fitness"
  }'
```

The function will:
1. Download the PDF
2. Upload to Cloud Storage
3. Import to Vertex AI RAG Corpus
4. Track metadata in Firestore

## How It Works

### PDF Import Process

```typescript
// 1. Upload PDF to Cloud Storage
const gcsUri = "gs://your-bucket/knowledge-base/fitness/guide.pdf";

// 2. Import to Vertex AI RAG
await importPdfToCorpus(gcsUri, "fitness-guide.pdf");

// Vertex AI automatically:
// - Extracts text from PDF
// - Chunks into ~1000 character segments
// - Generates embeddings
// - Indexes for fast retrieval
```

### Query Process

```typescript
// 1. User asks: "What exercises target lats?"

// 2. Retrieve context from Vertex AI RAG
const { contexts, sources } = await retrieveContext(query);
// Vertex AI automatically:
// - Embeds the query
// - Searches the corpus
// - Returns top 5 relevant chunks

// 3. Generate response with Gemini
const response = await gemini.generateContent({
  prompt: systemPrompt + contexts + userQuery
});

// 4. Return personalized answer with sources
```

## API Reference

### Core Functions

#### `getOrCreateCorpus()`
Gets existing RAG corpus or creates a new one.

```typescript
const corpusName = await getOrCreateCorpus();
// Returns: "projects/{project}/locations/{location}/ragCorpora/{corpus_id}"
```

#### `importPdfToCorpus(gcsUri, displayName)`
Imports a PDF from Cloud Storage to the RAG corpus.

```typescript
await importPdfToCorpus(
  "gs://my-bucket/fitness.pdf",
  "fitness-guide"
);
```

#### `retrieveContext(query, topK)`
Retrieves relevant context for a query.

```typescript
const { contexts, sources } = await retrieveContext(
  "How much protein should I eat?",
  5 // top K results
);
```

#### `deleteCorpusFile(fileName)`
Deletes a file from the RAG corpus.

```typescript
await deleteCorpusFile("fitness-guide.pdf");
```

## Configuration Options

### Chunking Configuration

```typescript
// In ragConfig.ts
chunking: {
  chunkSize: 1000,      // characters per chunk
  chunkOverlap: 200,    // overlap between chunks
}
```

### Retrieval Configuration

```typescript
// In ragConfig.ts
vertexRag: {
  retrievalConfig: {
    topK: 5,  // Number of chunks to retrieve
    filterExtractiveAnswers: false,
    filterExtractiveSegments: false,
  },
}
```

### Region Selection

Choose the region closest to your users:

```typescript
// In ragConfig.ts
vertexRag: {
  location: "us-central1",  // or "europe-west1", "asia-northeast1"
}
```

Available regions:
- `us-central1` (Iowa)
- `us-east4` (Virginia)
- `us-west1` (Oregon)
- `europe-west1` (Belgium)
- `europe-west4` (Netherlands)
- `asia-northeast1` (Tokyo)

## Monitoring

### View RAG Corpus

```bash
# List all corpora
gcloud ai rag-corpora list --location=us-central1

# Describe a corpus
gcloud ai rag-corpora describe CORPUS_ID --location=us-central1
```

### View Files in Corpus

```bash
# List files
gcloud ai rag-files list --rag-corpus=CORPUS_ID --location=us-central1
```

### Cloud Console

1. Go to [Vertex AI Console](https://console.cloud.google.com/vertex-ai)
2. Navigate to "RAG Engine"
3. View corpora, files, and query logs

## Cost Management

### Estimate Costs

**Typical Usage** (1000 users, 50 queries/day/user):

```
Document Ingestion:
- 10 PDFs × 50 pages = 500 pages
- 500 pages × $0.002 = $1

Storage:
- ~100MB of embeddings
- $0.10/GB/month × 0.1GB = $0.01/month

Queries:
- 50K queries/day × 30 days = 1.5M queries/month
- 1.5M queries × $0.02/1K = $30/month

Total: ~$31/month
```

### Optimize Costs

1. **Batch PDF uploads** to reduce API calls
2. **Cache common queries** on client side
3. **Use appropriate topK** (don't retrieve more than needed)
4. **Delete unused files** from corpus

## Troubleshooting

### Common Issues

#### 1. "Permission Denied" Error

**Solution**: Enable Vertex AI API
```bash
gcloud services enable aiplatform.googleapis.com
```

#### 2. "Corpus not found"

**Solution**: The corpus is created automatically on first use. If you see this error, check that the project ID is correct:

```typescript
// In ragConfig.ts
vertexRag: {
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
}
```

#### 3. "Invalid GCS URI"

**Solution**: Ensure the URI format is correct:
- ✅ `gs://bucket-name/path/to/file.pdf`
- ❌ `https://storage.googleapis.com/...`

#### 4. PDF Import Fails

**Possible causes**:
- PDF is encrypted
- PDF is corrupted
- File is not a valid PDF
- File is too large (>100MB)

**Solution**: Verify PDF is valid and under size limits

### Debug Mode

Enable detailed logging:

```typescript
// In your function
import * as logger from "firebase-functions/logger";

logger.setLogLevel("DEBUG");
```

## Migration from Pinecone

If you previously used Pinecone:

### 1. Remove Pinecone Dependencies

```bash
cd functions
npm uninstall @pinecone-database/pinecone @langchain/pinecone
```

### 2. Update Environment Variables

**Remove**:
```env
PINECONE_API_KEY=...
PINECONE_INDEX_NAME=...
```

**Keep**:
```env
GOOGLE_API_KEY=...
```

### 3. Re-import PDFs

Since Pinecone and Vertex AI use different storage formats, you'll need to re-import all PDFs:

```bash
# For each PDF previously in Pinecone:
# 1. Upload to Cloud Storage
# 2. Import to Vertex AI RAG Corpus using uploadKnowledgePdf function
```

### 4. Update Frontend Code

No changes needed! The Cloud Function API remains the same.

## Best Practices

### 1. Organize PDFs in Cloud Storage

```
gs://your-bucket/
  └── knowledge-base/
      ├── fitness/
      │   ├── strength-training.pdf
      │   ├── cardio-guide.pdf
      │   └── recovery.pdf
      └── nutrition/
          ├── macros-101.pdf
          ├── meal-timing.pdf
          └── supplements.pdf
```

### 2. Track Metadata in Firestore

```typescript
// Store PDF metadata for easy management
{
  fileName: "strength-training.pdf",
  category: "fitness",
  gcsUri: "gs://bucket/fitness/strength-training.pdf",
  corpusName: "projects/.../ragCorpora/123",
  uploadedAt: timestamp,
  status: "processed"
}
```

### 3. Implement Versioning

When updating PDFs:

```typescript
// Delete old version
await deleteCorpusFile("strength-training-v1.pdf");

// Import new version
await importPdfToCorpus(
  "gs://bucket/strength-training-v2.pdf",
  "strength-training-v2.pdf"
);
```

### 4. Monitor Query Performance

```typescript
// Log query performance
const startTime = Date.now();
const result = await retrieveContext(query);
const duration = Date.now() - startTime;

logger.info("Query performance", {
  query,
  duration,
  contextsRetrieved: result.contexts.length,
});
```

## Security

### IAM Permissions

Cloud Functions automatically have these permissions:
- `aiplatform.ragCorpora.create`
- `aiplatform.ragCorpora.get`
- `aiplatform.ragFiles.import`
- `aiplatform.ragFiles.delete`
- `storage.objects.get` (for reading PDFs)

### Data Privacy

- All data stays within your Google Cloud project
- Complies with GDPR (if using EU region)
- No data shared with third parties
- Encrypted at rest and in transit

## Resources

- [Vertex AI RAG Engine Docs](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/rag-api)
- [Vertex AI Pricing](https://cloud.google.com/vertex-ai/pricing)
- [Cloud Storage Best Practices](https://cloud.google.com/storage/docs/best-practices)
- [IAM for Vertex AI](https://cloud.google.com/vertex-ai/docs/general/access-control)
