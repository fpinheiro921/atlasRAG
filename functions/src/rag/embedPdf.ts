/**
 * PDF Processing and Import to Vertex AI RAG Engine
 * This function handles uploading fitness/nutrition PDFs to the knowledge base
 */

import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import { importPdfToCorpus, deleteCorpusFile } from "./vertexRagClient";

export interface PdfProcessingInput {
  gcsUri: string; // gs://bucket-name/path/to/file.pdf
  fileName: string;
  category: "fitness" | "nutrition" | "general";
}

export interface PdfProcessingResult {
  success: boolean;
  corpusName?: string;
  error?: string;
}

/**
 * Process a PDF and import to Vertex AI RAG corpus
 * The PDF should already be uploaded to Cloud Storage
 */
export async function processPdfToRagCorpus(
  input: PdfProcessingInput
): Promise<PdfProcessingResult> {
  try {
    logger.info("Starting PDF processing with Vertex AI RAG", {
      gcsUri: input.gcsUri,
      fileName: input.fileName,
    });

    // Validate GCS URI format
    if (!input.gcsUri.startsWith("gs://")) {
      throw new Error("Invalid GCS URI format. Must start with gs://");
    }

    // Import PDF to RAG corpus
    // Vertex AI RAG Engine handles:
    // - PDF text extraction
    // - Chunking
    // - Embedding generation
    // - Indexing
    const corpusName = await importPdfToCorpus(input.gcsUri, input.fileName);

    // Store metadata in Firestore for tracking
    await admin.firestore().collection("knowledgeBase").add({
      fileName: input.fileName,
      category: input.category,
      gcsUri: input.gcsUri,
      corpusName,
      uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: "processed",
    });

    logger.info("PDF processing complete", {
      fileName: input.fileName,
      corpusName,
    });

    return {
      success: true,
      corpusName,
    };
  } catch (error) {
    logger.error("Error processing PDF", { error, input });
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Delete a PDF from the RAG corpus
 */
export async function deletePdfFromRagCorpus(fileName: string): Promise<boolean> {
  try {
    logger.info("Deleting PDF from RAG corpus", { fileName });

    // Delete from Vertex AI RAG corpus
    const deleted = await deleteCorpusFile(fileName);

    if (deleted) {
      // Update Firestore metadata
      const knowledgeBaseRef = admin.firestore().collection("knowledgeBase");
      const snapshot = await knowledgeBaseRef.where("fileName", "==", fileName).get();

      const batch = admin.firestore().batch();
      snapshot.docs.forEach((doc) => {
        batch.update(doc.ref, {
          status: "deleted",
          deletedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      });
      await batch.commit();
    }

    return deleted;
  } catch (error) {
    logger.error("Error deleting PDF", { error, fileName });
    return false;
  }
}

/**
 * Upload PDF from URL to Cloud Storage, then import to RAG corpus
 * This is a convenience function for the complete workflow
 */
export async function uploadAndProcessPdf(
  pdfUrl: string,
  fileName: string,
  category: "fitness" | "nutrition" | "general"
): Promise<PdfProcessingResult> {
  try {
    logger.info("Uploading PDF to Cloud Storage", { pdfUrl, fileName });

    // Download PDF
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error(`Failed to download PDF: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloud Storage
    const bucket = admin.storage().bucket();
    const file = bucket.file(`knowledge-base/${category}/${fileName}`);

    await file.save(buffer, {
      metadata: {
        contentType: "application/pdf",
        metadata: {
          category,
          uploadedAt: new Date().toISOString(),
        },
      },
    });

    logger.info("PDF uploaded to Cloud Storage", { fileName });

    // Get GCS URI
    const gcsUri = `gs://${bucket.name}/${file.name}`;

    // Process with RAG
    return await processPdfToRagCorpus({
      gcsUri,
      fileName,
      category,
    });
  } catch (error) {
    logger.error("Error uploading and processing PDF", { error, pdfUrl });
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
