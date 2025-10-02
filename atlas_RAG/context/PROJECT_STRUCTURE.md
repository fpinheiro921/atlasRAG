### 3. Project Structure

#### 3.1 Directory Tree

```
atlas/
├── web/ # Next.js Frontend App
│ ├── app/
│ │ ├── (auth)/
│ │ ├── dashboard/
│ │ └── layout.tsx
│ ├── components/
│ │ ├── ui/ # Radix + Tailwind components
│ │ └── feature/ # Feature-specific components
│ ├── firebase/ # Firebase client config and hooks
│ │ └── client.ts
│ └── lib/
├── functions/ # Firebase Functions
│ ├── src/
│ │ ├── calculations.ts # TDEE calculation logic
│ │ ├── index.ts # Main entry point for functions
│ │ └── types.ts
│ ├── package.json
│ └── tsconfig.json
├── .firebaserc # Firebase project aliases (dev, prod)
├── firebase.json # Firebase project configuration
├── firestore.rules # Firestore security rules
└── firestore.indexes.json # Firestore composite indexes
```

-----

#### 3.2 Folder Contracts

 * **`web/`**: The Next.js frontend application, deployed to Firebase Hosting.
 * **`web/firebase/client.ts`**: Initializes the client-side Firebase app and exports service instances (auth, firestore). Critically, this file configures the app to point to the Emulator Suite when in development.
 * **`functions/`**: The backend logic deployed to Cloud Functions. It has its own `package.json` and dependencies.
 * **`firestore.rules`**: **The most critical security file.** Defines who can read, write, and query data in Firestore. See §10.
 * **`firebase.json`**: Defines which services to deploy, configures Hosting rewrites (to point API calls to functions), and sets up the Emulator Suite.

-----

#### 3.3 Bootstrap Script

A `package.json` script in the root will install dependencies for both the web app and functions.

```json
// root package.json
"scripts": {
 "install:all": "npm install && (cd web && npm install) && (cd functions && npm install)",
 "dev": "firebase emulators:start --import=./seed-data & (cd web && npm run dev)"
}
```