/**
 * Vertex AI RAG Engine Client
 * Manages RAG Corpus and File operations
 */

import * as logger from "firebase-functions/logger";
import { v1 } from "@google-cloud/aiplatform";
import { RAG_CONFIG } from "./ragConfig";

const { VertexRagDataServiceClient } = v1;
const { VertexRagServiceClient } = v1;

// Initialize clients
let ragDataClient: v1.VertexRagDataServiceClient;
let ragServiceClient: v1.VertexRagServiceClient;

function getRagDataClient(): v1.VertexRagDataServiceClient {
  if (!ragDataClient) {
    ragDataClient = new VertexRagDataServiceClient({
      apiEndpoint: `${RAG_CONFIG.vertexRag.location}-aiplatform.googleapis.com`,
    });
  }
  return ragDataClient;
}

function getRagServiceClient(): v1.VertexRagServiceClient {
  if (!ragServiceClient) {
    ragServiceClient = new VertexRagServiceClient({
      apiEndpoint: `${RAG_CONFIG.vertexRag.location}-aiplatform.googleapis.com`,
    });
  }
  return ragServiceClient;
}

/**
 * Get or create RAG corpus
 */
export async function getOrCreateCorpus(): Promise<string> {
  const client = getRagDataClient();
  const parent = `projects/${RAG_CONFIG.vertexRag.projectId}/locations/${RAG_CONFIG.vertexRag.location}`;

  try {
    // List existing corpora
    const [corpora] = await client.listRagCorpora({ parent });

    // Find corpus by display name
    const existingCorpus = corpora.find(
      (corpus) => corpus.displayName === RAG_CONFIG.vertexRag.corpusDisplayName
    );

    if (existingCorpus && existingCorpus.name) {
      logger.info("Found existing RAG corpus", { name: existingCorpus.name });
      return existingCorpus.name;
    }

    // Create new corpus
    logger.info("Creating new RAG corpus");
    const [operation] = await client.createRagCorpus({
      parent,
      ragCorpus: {
        displayName: RAG_CONFIG.vertexRag.corpusDisplayName,
        description: "Fitness and nutrition knowledge base for Atlas app",
      },
    });

    // Wait for operation to complete
    const [corpus] = await operation.promise();
    logger.info("Created RAG corpus", { name: corpus.name });

    return corpus.name || "";
  } catch (error) {
    logger.error("Error managing RAG corpus", { error });
    throw error;
  }
}

/**
 * Import PDF file from Cloud Storage to RAG corpus
 */
export async function importPdfToCorpus(
  gcsUri: string,
  displayName: string
): Promise<string> {
  const client = getRagDataClient();
  const corpusName = await getOrCreateCorpus();

  try {
    logger.info("Importing PDF to RAG corpus", { gcsUri, displayName });

    // Import file
    const [operation] = await client.importRagFiles({
      parent: corpusName,
      importRagFilesConfig: {
        gcsSource: {
          uris: [gcsUri],
        },
        ragFileChunkingConfig: {
          chunkSize: RAG_CONFIG.chunking.chunkSize,
          chunkOverlap: RAG_CONFIG.chunking.chunkOverlap,
        },
      },
    });

    // Wait for import to complete
    const [response] = await operation.promise();
    const importedFiles = response.importedRagFilesCount || 0;

    logger.info("PDF import complete", {
      gcsUri,
      importedFiles,
    });

    return corpusName;
  } catch (error) {
    logger.error("Error importing PDF to corpus", { error, gcsUri });
    throw error;
  }
}

/**
 * List all files in the RAG corpus
 */
export async function listCorpusFiles(): Promise<any[]> {
  const client = getRagDataClient();
  const corpusName = await getOrCreateCorpus();

  try {
    const [files] = await client.listRagFiles({
      parent: corpusName,
    });

    return files || [];
  } catch (error) {
    logger.error("Error listing corpus files", { error });
    return [];
  }
}

/**
 * Delete a file from the RAG corpus
 */
export async function deleteCorpusFile(fileName: string): Promise<boolean> {
  const client = getRagDataClient();
  const corpusName = await getOrCreateCorpus();

  try {
    // Find the file
    const files = await listCorpusFiles();
    const fileToDelete = files.find((f) =>
      f.displayName?.includes(fileName) || f.name?.includes(fileName)
    );

    if (!fileToDelete || !fileToDelete.name) {
      logger.warn("File not found in corpus", { fileName });
      return false;
    }

    // Delete the file
    await client.deleteRagFile({
      name: fileToDelete.name,
    });

    logger.info("Deleted file from corpus", { fileName });
    return true;
  } catch (error) {
    logger.error("Error deleting file from corpus", { error, fileName });
    return false;
  }
}

/**
 * Retrieve relevant context for a query
 */
export async function retrieveContext(
  query: string,
  topK: number = RAG_CONFIG.vertexRag.retrievalConfig.topK
): Promise<{ contexts: string[]; sources: string[] }> {
  const ragServiceClient = getRagServiceClient();
  const corpusName = await getOrCreateCorpus();

  try {
    logger.info("Retrieving context for query", { query });

    const [response] = await ragServiceClient.retrieveContexts({
      parent: `projects/${RAG_CONFIG.vertexRag.projectId}/locations/${RAG_CONFIG.vertexRag.location}`,
      query: {
        text: query,
        similarityTopK: topK,
      },
      vertexRagStore: {
        ragCorpora: [corpusName],
      },
    });

    const contexts: string[] = [];
    const sources: Set<string> = new Set();

    if (response.contexts && response.contexts.contexts) {
      for (const context of response.contexts.contexts) {
        if (context.text) {
          contexts.push(context.text);
        }
        if (context.sourceUri) {
          sources.add(context.sourceUri);
        }
      }
    }

    logger.info("Retrieved contexts", {
      query,
      contextCount: contexts.length,
      sourceCount: sources.size,
    });

    return {
      contexts,
      sources: Array.from(sources),
    };
  } catch (error) {
    logger.error("Error retrieving context", { error, query });
    return {
      contexts: [],
      sources: [],
    };
  }
}
