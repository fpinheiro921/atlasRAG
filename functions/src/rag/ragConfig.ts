/**
 * Configuration for the RAG system using Vertex AI RAG Engine
 */

export const RAG_CONFIG = {
  // Gemini configuration
  gemini: {
    model: "gemini-1.5-pro", // or "gemini-1.5-flash" for faster/cheaper responses
    temperature: 0.7,
    maxTokens: 2048,
    topK: 40,
    topP: 0.95,
  },

  // Vertex AI RAG Engine configuration
  vertexRag: {
    projectId: process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT,
    location: "us-central1", // or your preferred region
    corpusDisplayName: "atlas-fitness-knowledge",
    // RAG retrieval config
    retrievalConfig: {
      topK: 5, // Number of relevant chunks to retrieve
      filterExtractiveAnswers: false,
      filterExtractiveSegments: false,
    },
  },

  // Chunking configuration for PDF processing
  chunking: {
    chunkSize: 1000, // characters per chunk
    chunkOverlap: 200, // overlap between chunks
  },

  // System prompt for the AI coach
  systemPrompt: `You are an expert fitness trainer and nutrition specialist integrated into the Atlas app.
Your knowledge comes from scientific research papers, training methodologies, and nutrition guidelines.

Your role is to:
1. Provide evidence-based fitness and nutrition advice
2. Answer questions about training techniques, exercise form, and program design
3. Explain nutritional concepts and meal planning strategies
4. Help users understand their macro targets and how to meet them
5. Offer motivation and support while being realistic about expectations

Guidelines:
- Base your responses on the scientific knowledge provided in the context
- Be encouraging but realistic about timelines and results
- Always prioritize safety and proper form
- Recommend consulting healthcare professionals for medical concerns
- Use the user's current stats when relevant to personalize advice
- Keep responses concise and actionable
- Provide specific, practical recommendations

Context from knowledge base:
{context}

User's current profile:
{userContext}

Remember: Always ground your advice in the scientific context provided and personalize it to the user's specific situation.`,
};

export interface RagContext {
  weightKg?: number;
  goalType?: string;
  activePlan?: {
    caloriesTarget: number;
    proteinTargetG: number;
    carbsTargetG: number;
    fatTargetG: number;
  };
}

export function formatUserContext(context?: RagContext): string {
  if (!context) return "No user context available";

  const parts: string[] = [];

  if (context.weightKg) {
    parts.push(`Current weight: ${context.weightKg}kg`);
  }

  if (context.goalType) {
    const goalDisplay = context.goalType.replace("_", " ");
    parts.push(`Goal: ${goalDisplay}`);
  }

  if (context.activePlan) {
    parts.push(
      `Daily targets: ${context.activePlan.caloriesTarget} kcal ` +
      `(${context.activePlan.proteinTargetG}g protein, ` +
      `${context.activePlan.carbsTargetG}g carbs, ` +
      `${context.activePlan.fatTargetG}g fat)`
    );
  }

  return parts.join(" | ");
}
