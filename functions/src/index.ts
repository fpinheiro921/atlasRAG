/**
 * Cloud Functions for Atlas
 * Main entry point for all Firebase Cloud Functions
 */

import { onRequest } from "firebase-functions/v2/https";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import {
  calculateOnboardingPlan,
  calculateWeeklyAdjustment,
} from "./calculations";
import { processRagQuery } from "./rag/queryRag";
import { processPdfToVectorDb } from "./rag/embedPdf";
import {
  OnboardingInput,
  WeeklyCheckInData,
  RagQueryRequest,
} from "./types";

// Initialize Firebase Admin
admin.initializeApp();

// ============================================
// Onboarding & Calculation Functions
// ============================================

/**
 * Calculate personalized nutrition plan during onboarding
 * Callable function - requires authentication
 */
export const calculatePlan = onCall(async (request) => {
  // Check authentication
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be authenticated");
  }

  try {
    const input = request.data as OnboardingInput;

    // Validate input
    if (!input.age || !input.sex || !input.bodyWeightKg || !input.bodyFatPercentage) {
      throw new HttpsError("invalid-argument", "Missing required fields");
    }

    logger.info("Calculating plan for user", { userId: request.auth.uid });

    const plan = calculateOnboardingPlan(input);

    return { success: true, plan };
  } catch (error) {
    logger.error("Error calculating plan", { error });

    if (error instanceof HttpsError) {
      throw error;
    }

    throw new HttpsError(
      "internal",
      error instanceof Error ? error.message : "Failed to calculate plan"
    );
  }
});

/**
 * Process weekly check-in and determine adjustments
 * Callable function - requires authentication
 */
export const processWeeklyCheckIn = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be authenticated");
  }

  try {
    const data = request.data as WeeklyCheckInData;

    logger.info("Processing weekly check-in", { userId: request.auth.uid });

    // Get user's current weight for percentage calculations
    const userDoc = await admin.firestore()
      .collection("users")
      .doc(request.auth.uid)
      .get();

    if (!userDoc.exists) {
      throw new HttpsError("not-found", "User profile not found");
    }

    // Calculate adjustment
    const adjustment = calculateWeeklyAdjustment(
      data.currentWeightAvg,
      data.previousWeightAvg,
      data.goalType,
      data.currentPlan,
      data.currentWeightAvg // Using current weight avg as body weight
    );

    // If adjustment needed, update the active goal
    if (adjustment.shouldAdjust && adjustment.newPlan) {
      // Find active goal
      const goalsSnapshot = await admin.firestore()
        .collection("users")
        .doc(request.auth.uid)
        .collection("goals")
        .where("isActive", "==", true)
        .limit(1)
        .get();

      if (!goalsSnapshot.empty) {
        const goalDoc = goalsSnapshot.docs[0];
        await goalDoc.ref.update({
          activePlan: adjustment.newPlan,
        });
      }
    }

    return { success: true, adjustment };
  } catch (error) {
    logger.error("Error processing weekly check-in", { error });

    if (error instanceof HttpsError) {
      throw error;
    }

    throw new HttpsError(
      "internal",
      error instanceof Error ? error.message : "Failed to process check-in"
    );
  }
});

// ============================================
// RAG (AI Coach) Functions
// ============================================

/**
 * Query the RAG system for fitness/nutrition advice
 * Callable function - requires authentication
 */
export const queryAiCoach = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be authenticated");
  }

  try {
    const data = request.data as RagQueryRequest;

    if (!data.query || data.query.trim().length === 0) {
      throw new HttpsError("invalid-argument", "Query cannot be empty");
    }

    logger.info("Processing AI coach query", {
      userId: request.auth.uid,
      query: data.query.substring(0, 100),
    });

    // Process the query
    const result = await processRagQuery({
      query: data.query,
      userContext: data.userContext,
    });

    // Save to chat history
    await admin.firestore()
      .collection("users")
      .doc(request.auth.uid)
      .collection("chatHistory")
      .add({
        role: "user",
        content: data.query,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

    await admin.firestore()
      .collection("users")
      .doc(request.auth.uid)
      .collection("chatHistory")
      .add({
        role: "assistant",
        content: result.response,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        sources: result.sources || [],
      });

    return { success: true, result };
  } catch (error) {
    logger.error("Error querying AI coach", { error });

    if (error instanceof HttpsError) {
      throw error;
    }

    throw new HttpsError(
      "internal",
      error instanceof Error ? error.message : "Failed to process query"
    );
  }
});

/**
 * Admin function to upload and process PDFs to knowledge base
 * HTTP endpoint - requires admin authentication
 */
export const uploadKnowledgePdf = onRequest(async (req, res) => {
  // CORS handling
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
    res.status(204).send("");
    return;
  }

  try {
    // Verify admin authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Check if user has admin custom claim
    if (!decodedToken.admin) {
      res.status(403).json({ error: "Admin access required" });
      return;
    }

    const { pdfUrl, fileName, category } = req.body;

    if (!pdfUrl || !fileName || !category) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    logger.info("Processing PDF upload", { fileName, category });

    const result = await processPdfToVectorDb({
      pdfUrl,
      fileName,
      category,
    });

    res.json(result);
  } catch (error) {
    logger.error("Error uploading PDF", { error });
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to process PDF",
    });
  }
});

// ============================================
// Auth Triggers
// ============================================

/**
 * Create user profile document when new user signs up
 */
export const onUserCreate = onDocumentCreated(
  "users/{userId}",
  async (event) => {
    const userId = event.params.userId;

    logger.info("New user created", { userId });

    // You can add initialization logic here
    // For example, sending a welcome email or creating default settings

    return null;
  }
);
