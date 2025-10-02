# Google Gemini Integration Guide

## Overview

Atlas uses **Google Gemini** instead of OpenAI for its RAG (Retrieval Augmented Generation) system. This provides:
- **Cost efficiency**: Gemini has generous free tier (15 RPM, 1500 RPD)
- **High quality**: Gemini 1.5 Pro matches GPT-4 performance
- **Better embeddings**: text-embedding-004 with 768 dimensions
- **Native integration**: Works seamlessly with Firebase/GCP ecosystem

## Architecture

```
User Query
    ↓
[Gemini Embeddings] → Generate query embedding (768-dim vector)
    ↓
[Pinecone Search] → Find similar knowledge chunks
    ↓
[Context Extraction] → Retrieve top 5 relevant text chunks
    ↓
[Gemini 1.5 Pro] → Generate personalized response
    ↓
User Response
```

## Components

### 1. Embedding Model: `text-embedding-004`
- **Dimensions**: 768 (vs OpenAI's 1536)
- **Performance**: State-of-the-art for retrieval tasks
- **Cost**: Free within rate limits
- **Rate Limits** (Free tier):
  - 1500 requests per day
  - 15 requests per minute

**Usage in Atlas**:
```typescript
const embeddingModel = genAI.getGenerativeModel({
  model: "text-embedding-004"
});

const result = await embeddingModel.embedContent(text);
const embedding = result.embedding.values; // 768-dimensional vector
```

### 2. LLM: `gemini-1.5-pro`
- **Context window**: 1M tokens (vs GPT-4's 128K)
- **Quality**: Comparable to GPT-4 Turbo
- **Speed**: Fast response times
- **Cost**: Free within rate limits

**Alternative**: `gemini-1.5-flash`
- Faster responses
- Lower latency
- Same free tier
- Slightly lower quality

**Usage in Atlas**:
```typescript
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 2048,
    topK: 40,
    topP: 0.95,
  },
});

const result = await model.generateContent(prompt);
const response = result.response.text();
```

## Configuration

### Pinecone Index Setup

**Important**: Gemini embeddings are **768 dimensions**, not 1536!

```
Index Name: atlas-fitness-knowledge
Dimensions: 768
Metric: cosine
Region: Choose closest to your Cloud Functions region
```

### Environment Variables

```env
# functions/.env
GOOGLE_API_KEY=your_api_key_from_ai_studio
PINECONE_API_KEY=your_pinecone_key
PINECONE_INDEX_NAME=atlas-fitness-knowledge
```

### Getting Google AI API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key to `functions/.env`

**Note**: This is NOT a Firebase key - it's specifically for Google AI/Gemini.

## Rate Limits & Quotas

### Free Tier (Default)
- **Requests per minute**: 15
- **Requests per day**: 1500
- **Tokens per minute**: 1M
- **Perfect for**: Development, low-traffic MVP, testing

### Paid Tier (Pay-as-you-go)
Pricing (as of 2024):
- Gemini 1.5 Pro:
  - Input: $3.50 per 1M tokens
  - Output: $10.50 per 1M tokens
- text-embedding-004:
  - $0.025 per 1M tokens

**Compared to OpenAI**:
- ~10x cheaper than GPT-4
- ~50x cheaper for embeddings

## Implementation Details

### PDF Processing Flow

1. **Upload PDF** → Firebase Storage
2. **Extract Text** → pdf-parse library
3. **Split into Chunks** → LangChain (1000 chars, 200 overlap)
4. **Generate Embeddings** → Gemini text-embedding-004
5. **Store in Pinecone** → 768-dim vectors with metadata

```typescript
// Batch processing to respect rate limits
const batchSize = 5;
for (let i = 0; i < chunks.length; i += batchSize) {
  // Process batch
  await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limit buffer
}
```

### Query Flow

1. **User asks question** → "What exercises target lats?"
2. **Embed query** → Gemini converts to 768-dim vector
3. **Search Pinecone** → Find top 5 similar knowledge chunks
4. **Build context** → Combine chunks + user profile data
5. **Generate response** → Gemini 1.5 Pro with full context
6. **Return answer** → Personalized, source-cited response

```typescript
// Context-aware prompt structure
const prompt = `
${systemPrompt}

Context from knowledge base:
${retrievedChunks}

User's profile:
Weight: ${userWeight}kg | Goal: ${userGoal} | Macros: ${userMacros}

User Question: ${userQuestion}

Your Response:
`;
```

## Advantages vs OpenAI

### Cost Efficiency
```
Typical Monthly Usage (1000 users, 50 queries/day):
- OpenAI: $100-300/month
- Gemini: $0 (free tier) or $10-30/month
```

### Performance
- **Context Window**: Gemini (1M tokens) >> GPT-4 (128K tokens)
- **Latency**: Similar response times
- **Quality**: Comparable for fitness/nutrition domain

### Integration
- Native Google Cloud integration
- Same account as Firebase
- Unified billing (if paid)
- Better GDPR compliance for EU users

## Monitoring & Optimization

### Check Usage

Google AI Studio Dashboard:
- https://aistudio.google.com/app/apikey
- View requests/day
- Monitor quota usage
- Set up alerts

### Optimization Strategies

**1. Use gemini-1.5-flash for simple queries**
```typescript
// For quick factual questions
const simpleModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});
```

**2. Implement caching**
```typescript
// Cache common queries
const cacheKey = `query:${hash(userQuery)}`;
const cached = await redis.get(cacheKey);
if (cached) return cached;
```

**3. Batch embeddings**
```typescript
// Process multiple PDFs efficiently
await Promise.all(pdfs.map(pdf => processPdf(pdf)));
```

**4. Rate limit client-side**
```typescript
// Debounce chat input
const debouncedQuery = useMemo(
  () => debounce(sendQuery, 1000),
  []
);
```

## Error Handling

### Common Errors

**1. Rate Limit Exceeded**
```
Error: 429 Resource Exhausted
```
**Solution**: Implement retry with exponential backoff

```typescript
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429 && i < maxRetries - 1) {
        await new Promise(resolve =>
          setTimeout(resolve, Math.pow(2, i) * 1000)
        );
      } else {
        throw error;
      }
    }
  }
}
```

**2. Invalid API Key**
```
Error: 401 Unauthorized
```
**Solution**: Verify GOOGLE_API_KEY in functions/.env

**3. Dimension Mismatch**
```
Error: Pinecone dimension mismatch (expected 768, got 1536)
```
**Solution**: Recreate Pinecone index with 768 dimensions

## Migration from OpenAI

If you previously used OpenAI:

### 1. Update Pinecone Index
```bash
# Delete old index (1536 dimensions)
# Create new index (768 dimensions)
```

### 2. Re-process PDFs
All existing embeddings must be regenerated with Gemini

### 3. Update Environment Variables
```bash
# Remove
OPENAI_API_KEY=...

# Add
GOOGLE_API_KEY=...
```

### 4. Update Dependencies
```bash
cd functions
npm uninstall openai @langchain/openai
npm install @google/generative-ai @langchain/google-genai
```

## Testing

### Test Embedding Generation
```typescript
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

const result = await model.embedContent("Test text");
console.log("Dimensions:", result.embedding.values.length); // Should be 768
```

### Test Text Generation
```typescript
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
const result = await model.generateContent("What is progressive overload?");
console.log(result.response.text());
```

### Test RAG Pipeline
```bash
# Use Firebase Emulator
firebase emulators:start

# Call queryAiCoach function
curl -X POST http://localhost:5001/your-project/us-central1/queryAiCoach \
  -H "Content-Type: application/json" \
  -d '{"query": "How much protein should I eat?"}'
```

## Production Checklist

- [ ] Google AI API key configured
- [ ] Pinecone index created with 768 dimensions
- [ ] PDFs processed and uploaded to vector database
- [ ] Rate limiting implemented
- [ ] Error handling in place
- [ ] Monitoring/logging configured
- [ ] Fallback responses for failures
- [ ] User quota management (if needed)

## Resources

- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API Docs](https://ai.google.dev/docs)
- [Gemini Pricing](https://ai.google.dev/pricing)
- [Rate Limits](https://ai.google.dev/docs/rate_limits)
- [Best Practices](https://ai.google.dev/docs/best_practices)

## Support

For issues with Gemini integration:
1. Check API key is valid
2. Verify rate limits not exceeded
3. Confirm Pinecone dimensions match (768)
4. Review Cloud Function logs
5. Test with Firebase Emulator locally
