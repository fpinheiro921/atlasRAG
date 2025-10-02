### 10. Security Guidelines

#### 10.1 Guiding Principle: Client is Untrusted

All security is enforced by the backend, primarily through **Firestore Security Rules**. The client is never trusted to make correct authorization decisions.

#### 10.2 Firestore Security Rules

These rules are the primary security mechanism for the database. They are uploaded with every deploy.

```
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function to check if the user is signed in
    function isSignedIn() {
      return request.auth != null;
    }

    // Helper function to check if the user is the owner of the document
    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    // Users Collection
    match /users/{userId} {
      // A user can only read their own document.
      allow read: if isSignedIn() && isOwner(userId);
      // A user can only create their own document upon signup.
      allow create: if isSignedIn() && isOwner(userId);
      // A user can only update their own profile data.
      allow update: if isSignedIn() && isOwner(userId);
      // Users cannot delete their accounts directly via Firestore.
      // This should be done via a Cloud Function to handle cleanup.
      allow delete: if false;
    }

    // Match any subcollection under any user's document
    match /users/{userId}/{collection}/{docId} {
        // A user can read/write/delete any document in any of their own subcollections.
        // This rule covers goals, dailyCheckIns, foodLogEntries, etc.
        allow read, write, delete: if isSignedIn() && isOwner(userId);
    }
  }
}
```

#### 10.3 Cloud Function Security

  * **Callable Functions:** Use `onCall` functions instead of simple `onRequest` functions whenever possible. Callable functions automatically pass along the user's authentication context, making it easy to check `context.auth.uid` inside the function.
  * **IAM:** Each Cloud Function runs with a specific service account. Follow the principle of least privilege. If a function only needs to read from Firestore, grant its service account the "Cloud Datastore User" role, not "Editor."

#### 10.4 Firebase App Check

Implement App Check to ensure that requests to Firebase resources (Firestore, Functions) are coming from your legitimate application and not from unauthorized clients. It uses attestation services like Play Integrity on Android, DeviceCheck on Apple, and reCAPTCHA v3 on web.