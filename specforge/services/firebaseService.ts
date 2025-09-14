
// services/firebaseService.ts
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { auth, db, googleProvider } from '../firebaseConfig';
import { SavedSpec } from '../components/SavedSpecsModal';

const MEMBER_GENERATIONS_LIMIT = 50;

export interface UserProfile {
  uid: string;
  generationsUsedThisMonth: number;
  monthlyCycleStart: firebase.firestore.Timestamp;
  generationsLimit: number;
}

const handleFirestoreError = (error: any, context: string): Error => {
    console.error(`Error ${context}:`, error);
    if (error.code === 'permission-denied') {
        const firestoreRulesUrl = `https://console.firebase.google.com/project/dulcet-opus-461713-n0/firestore/rules`;
        const detailedMessage = `
Action Required: Update Firestore Security Rules

The operation '${context}' failed due to a Firestore permissions error. This is a common configuration issue in your Firebase project and must be fixed to allow users to log in and save data.

To Fix This:

1. Go to your Firebase Console Firestore Rules editor:
${firestoreRulesUrl}

2. Replace the existing rules in the editor with the complete, correct ruleset provided below. This ruleset ensures that users can only access their own data.

3. Click "Publish" and wait a moment for the changes to apply. Then, refresh this application.

--- START OF REQUIRED RULES ---

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Rule for user profiles
    // A user can read and write their own profile document, which is identified by their user ID (uid).
    match /userProfiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Rules for the 'specs' collection
    match /specs/{specId} {
      
      // Allow a user to create a new spec document if the 'userId' in the new document
      // matches their authenticated user ID.
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      
      // Allow a user to read, update, or delete a spec if the 'userId' in the existing
      // document matches their authenticated user ID.
      allow read, update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
      
      // Allow a signed-in user to query (list) the 'specs' collection.
      // IMPORTANT: This rule relies on the client-side code to be secure. The application's queries
      // MUST include a 'where("userId", "==", request.auth.uid)' clause. This application already does this.
      allow list: if request.auth != null;
    }
  }
}

--- END OF REQUIRED RULES ---
        `;
        return new Error(detailedMessage.trim());
    }
    return new Error(error.message || `An unknown error occurred during '${context}'.`);
};

export const getOrCreateUserProfile = async (userId: string): Promise<UserProfile> => {
    const userProfileRef = db.collection('userProfiles').doc(userId);
    try {
        let userProfileDoc = await userProfileRef.get();

        if (!userProfileDoc.exists) {
            console.log("Creating new user profile for:", userId);
            const newProfile: UserProfile = {
                uid: userId,
                generationsUsedThisMonth: 0,
                monthlyCycleStart: firebase.firestore.Timestamp.now(),
                generationsLimit: MEMBER_GENERATIONS_LIMIT,
            };
            await userProfileRef.set(newProfile);
            return newProfile;
        } else {
            const profileData = userProfileDoc.data() as UserProfile;
            const cycleStartDate = profileData.monthlyCycleStart.toDate();
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            let needsUpdate = false;
            let updatedProfileData = { ...profileData };
            
            if (cycleStartDate < thirtyDaysAgo) {
                console.log("Monthly cycle reset for user:", userId);
                updatedProfileData.generationsUsedThisMonth = 0;
                updatedProfileData.monthlyCycleStart = firebase.firestore.Timestamp.now();
                needsUpdate = true;
            }
            
            // Backfill or correct generationsLimit just in case
            if (profileData.generationsLimit !== MEMBER_GENERATIONS_LIMIT) {
                console.log(`Correcting generationsLimit for user ${userId}`);
                updatedProfileData.generationsLimit = MEMBER_GENERATIONS_LIMIT;
                needsUpdate = true;
            }

            // Remove deprecated 'plan' field if it exists
            if ('plan' in updatedProfileData) {
                delete (updatedProfileData as any).plan;
                needsUpdate = true;
            }

            if (needsUpdate) {
                await userProfileRef.set(updatedProfileData, { merge: true });
            }
            return updatedProfileData;
        }
    } catch (error: any) {
        throw handleFirestoreError(error, 'getting or creating user profile');
    }
};

export const incrementGenerationCount = async (userId: string): Promise<void> => {
    const userProfileRef = db.collection('userProfiles').doc(userId);
    try {
        await userProfileRef.update({
            generationsUsedThisMonth: firebase.firestore.FieldValue.increment(1)
        });
    } catch (error) {
        // We log the error but don't throw, to avoid breaking the user's flow after a successful generation.
        console.error("Failed to increment generation count:", error);
    }
};

export const signInWithGoogle = async (): Promise<firebase.auth.UserCredential> => {
  try {
    // This initiates a popup window for Google sign-in.
    const result = await auth.signInWithPopup(googleProvider);
    return result;
  } catch (error: any) {
    // The component that calls this will handle the specific error codes.
    console.error("Error during Google sign-in via popup:", error);
    throw error;
  }
};

export const signOutUser = async (): Promise<void> => {
  try {
    await auth.signOut();
  } catch (error: any)
  {
    console.error("Error signing out:", error);
    throw new Error(error.message || "An unknown error occurred during sign-out.");
  }
};

export const saveSpecToFirestore = async (
  userId: string,
  specData: Omit<SavedSpec, 'id' | 'savedAt'>
): Promise<string> => {
  try {
    const docRef = await db.collection("specs").add({
      ...specData,
      userId,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    return docRef.id;
  } catch (error: any) {
    throw handleFirestoreError(error, 'saving spec');
  }
};

export const updateUserInFirestore = async (
  specId: string,
  specData: Partial<SavedSpec>
): Promise<void> => {
  try {
    const specRef = db.collection("specs").doc(specId);
    await specRef.update({
      ...specData,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error: any) {
    throw handleFirestoreError(error, 'updating spec');
  }
};


export const getUserSpecs = async (userId: string): Promise<SavedSpec[]> => {
    try {
        const specsRef = db.collection("specs");
        const q = specsRef.where("userId", "==", userId);
        const querySnapshot = await q.get();
        const specs: SavedSpec[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            specs.push({
                id: doc.id,
                name: data.name,
                ideaText: data.ideaText,
                generatedSpec: data.generatedSpec,
                selectedModules: data.selectedModules,
                savedAt: data.updatedAt?.toDate()?.toISOString() || new Date().toISOString(),
            });
        });

        specs.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());

        return specs;
    } catch (error: any) {
        throw handleFirestoreError(error, 'loading user specs');
    }
};


export const deleteSpecFromFirestore = async (specId: string): Promise<void> => {
  try {
    await db.collection("specs").doc(specId).delete();
  } catch (error: any) {
    throw handleFirestoreError(error, 'deleting spec');
  }
};
