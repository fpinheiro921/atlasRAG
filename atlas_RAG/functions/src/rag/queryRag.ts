/**
 * RAG Query Handler using Google Gemini
 * Handles user queries by retrieving relevant context and generating responses
 */

import * as logger from "firebase-functions/logger";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { RAG_CONFIG, RagContext, formatUserContext } from "./ragConfig";

export interface QueryInput {
  query: string;
  userContext?: RagContext;
}

export interface QueryResult {
  response: string;
  sources: string[];
  error?: string;
}

/**
 * Process a user query using RAG with Gemini
 */
export async function processRagQuery(input: QueryInput): Promise<QueryResult> {
  try {
    logger.info("Processing RAG query with Gemini", { query: input.query });

    // Initialize clients
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || "",
    });

    // Step 1: Generate embedding for the user's query using Gemini
    const embeddingModel = genAI.getGenerativeModel({
      model: RAG_CONFIG.gemini.embeddingModel,
    });

    const embeddingResult = await embeddingModel.embedContent(input.query);
    const queryEmbedding = embeddingResult.embedding.values;

    // Step 2: Search for similar vectors in Pinecone
    const index = pinecone.Index(RAG_CONFIG.pinecone.indexName);

    const searchResults = await index.namespace(RAG_CONFIG.pinecone.namespace).query({
      vector: queryEmbedding,
      topK: RAG_CONFIG.pinecone.topK,
      includeMetadata: true,
    });

    logger.info(`Found ${searchResults.matches?.length || 0} relevant chunks`);

    // Step 3: Extract context from search results
    const contextChunks: string[] = [];
    const sources: Set<string> = new Set();

    if (searchResults.matches) {
      for (const match of searchResults.matches) {
        if (match.metadata && typeof match.metadata.text === "string") {
          contextChunks.push(match.metadata.text);
          if (typeof match.metadata.source === "string") {
            sources.add(match.metadata.source);
          }
        }
      }
    }

    const contextText = contextChunks.join("\n\n---\n\n");

    // Step 4: Format user context
    const userContextFormatted = formatUserContext(input.userContext);

    // Step 5: Build the complete prompt
    const systemPrompt = RAG_CONFIG.systemPrompt
      .replace("{context}", contextText || "No specific context available. Use general fitness and nutrition knowledge.")
      .replace("{userContext}", userContextFormatted);

    // Step 6: Generate response using Gemini
    const model = genAI.getGenerativeModel({
      model: RAG_CONFIG.gemini.model,
      generationConfig: {
        temperature: RAG_CONFIG.gemini.temperature,
        maxOutputTokens: RAG_CONFIG.gemini.maxTokens,
        topK: RAG_CONFIG.gemini.topK,
        topP: RAG_CONFIG.gemini.topP,
      },
    });

    // Combine system prompt and user query
    const fullPrompt = `${systemPrompt}\n\nUser Question: ${input.query}\n\nYour Response:`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response.text();

    logger.info("RAG query processed successfully with Gemini");

    return {
      response: response || "I apologize, but I couldn't generate a response. Please try rephrasing your question.",
      sources: Array.from(sources),
    };
  } catch (error) {
    logger.error("Error processing RAG query with Gemini", { error });

    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return {
      response: "I apologize, but I encountered an error processing your question. Please try again in a moment.",
      sources: [],
      error: errorMessage,
    };
  }
}

/**
 * Stream RAG response using Gemini (for future implementation)
 * This allows real-time streaming of the AI response
 */
export async function processRagQueryStreaming(input: QueryInput) {
  try {
    logger.info("Processing streaming RAG query with Gemini", { query: input.query });

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || "",
    });

    // Step 1: Generate embedding
    const embeddingModel = genAI.getGenerativeModel({
      model: RAG_CONFIG.gemini.embeddingModel,
    });

    const embeddingResult = await embeddingModel.embedContent(input.query);
    const queryEmbedding = embeddingResult.embedding.values;

    // Step 2: Search Pinecone
    const index = pinecone.Index(RAG_CONFIG.pinecone.indexName);
    const searchResults = await index.namespace(RAG_CONFIG.pinecone.namespace).query({
      vector: queryEmbedding,
      topK: RAG_CONFIG.pinecone.topK,
      includeMetadata: true,
    });

    // Step 3: Extract context
    const contextChunks: string[] = [];
    const sources: Set<string> = new Set();

    if (searchResults.matches) {
      for (const match of searchResults.matches) {
        if (match.metadata && typeof match.metadata.text === "string") {
          contextChunks.push(match.metadata.text);
          if (typeof match.metadata.source === "string") {
            sources.add(match.metadata.source);
          }
        }
      }
    }

    const contextText = contextChunks.join("\n\n---\n\n");
    const userContextFormatted = formatUserContext(input.userContext);

    // Step 4: Build prompt
    const systemPrompt = RAG_CONFIG.systemPrompt
      .replace("{context}", contextText || "No specific context available.")
      .replace("{userContext}", userContextFormatted);

    const fullPrompt = `${systemPrompt}\n\nUser Question: ${input.query}\n\nYour Response:`;

    // Step 5: Stream response
    const model = genAI.getGenerativeModel({
      model: RAG_CONFIG.gemini.model,
      generationConfig: {
        temperature: RAG_CONFIG.gemini.temperature,
        maxOutputTokens: RAG_CONFIG.gemini.maxTokens,
        topK: RAG_CONFIG.gemini.topK,
        topP: RAG_CONFIG.gemini.topP,
      },
    });

    const result = await model.generateContentStream(fullPrompt);

    // Return the stream for the caller to handle
    return {
      stream: result.stream,
      sources: Array.from(sources),
    };
  } catch (error) {
    logger.error("Error in streaming RAG query", { error });
    throw error;
  }
}
