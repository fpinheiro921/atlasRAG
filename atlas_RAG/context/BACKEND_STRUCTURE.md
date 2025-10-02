### 7. Backend Structure (Firebase)

#### 7.1 High-Level Diagram

 * **Client (Next.js PWA on Firebase Hosting)**
 * Interacts directly with **Firebase Auth** (for login).
 * Interacts directly with **Cloud Firestore** (for real-time data, governed by Security Rules).
 * Invokes **Cloud Functions** (for complex business logic).
 * **Cloud Functions**
 * Can be triggered via HTTPS requests from the client.
 * Can be triggered by events (e.g., `onUserCreate` from Auth, `onDocumentWrite` from Firestore).
 * Reads/writes to **Cloud Firestore**.
 * **Cloud Firestore**
 * The central database.
 * Security is enforced by **Firestore Security Rules**.

#### 7.2 Function Breakdown

 * **`calculateOnboardingPlan` (Callable Function):**
 * Trigger: HTTPS call from the client.
 * Action: Receives user inputs, performs the TDEE/macro calculation, and returns the plan. It does NOT write to the database; the client does, to ensure the user confirms first.
 * **`processWeeklyCheckIn` (Callable Function):**
 * Trigger: HTTPS call from the client.
 * Action: Receives the user's recent weight data, analyzes it, decides on an adjustment, and updates the user's active `goal` document in Firestore.
 * **`onUserCreate` (Auth Triggered Function):**
 * Trigger: A new user signs up with Firebase Auth.
 * Action: Creates the corresponding `users/{userId}` document in Firestore with default values.

#### 7.4 Edge Cases & Failure Modes

 * **Function Cold Starts:** The first invocation of a function after a period of inactivity may have higher latency.
 * **Mitigation:** For critical functions, configure a minimum number of instances to keep warm. Inform the user with a loading spinner on the client.
 * **Firestore Hot-spotting:** Rapidly writing to documents that are lexicographically close to each other can cause performance issues.
 * **Mitigation:** Our schema using user-specific subcollections naturally avoids this, as writes are distributed across different parts of the database.
 * **Exceeding Quotas:** Hitting Firestore read/write or function invocation limits.
 * **Mitigation:** Monitor usage in the Firebase console. Implement client-side logic to batch writes and avoid unnecessary reads. Upgrade Firebase plan if necessary.