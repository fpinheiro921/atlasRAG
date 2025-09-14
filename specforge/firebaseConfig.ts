// firebaseConfig.ts

// Add global declaration for Vite's import.meta.env to provide TypeScript support.
declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_API_KEY?: string;
      readonly VITE_FIREBASE_API_KEY?: string;
      readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
      readonly VITE_FIREBASE_PROJECT_ID?: string;
      readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
      readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
      readonly VITE_FIREBASE_APP_ID?: string;
    }
  }
}

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Firebase configuration using VITE environment variables for security.
// These variables must be set in your Vercel project settings or a .env.local file.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check for missing Firebase configuration. This is a critical check for developers.
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    const errorMessage = "CRITICAL: Firebase configuration is missing. Ensure all VITE_FIREBASE_* environment variables are set in your .env file for local development or in your hosting provider's settings for deployment. Authentication and database services will not work without them.";
    console.error(errorMessage);
    // In a real app, you might want to render an error page instead of a console log.
    // For this tool, a console error is sufficient to alert the developer.
}

// Initialize Firebase, but prevent re-initialization in a hot-reloading environment (like Vite).
const app: firebase.app.App = !firebase.apps.length 
    ? firebase.initializeApp(firebaseConfig) 
    : firebase.app();
    
const auth: firebase.auth.Auth = firebase.auth();
const db: firebase.firestore.Firestore = firebase.firestore();
const googleProvider: firebase.auth.GoogleAuthProvider = new firebase.auth.GoogleAuthProvider();

export { app, auth, db, googleProvider };