### 4. Schema Design (Cloud Firestore)

#### 4.1 Data Model (Collections & Documents)

Firestore is a NoSQL document database. Data is stored in documents, which are organized into collections. We will use a model that prioritizes denormalization for fast, efficient reads required by the frontend.

 * **`users/{userId}`** (Collection: `users`)

 * **Description:** Stores public-facing user profile information and settings. A document is created here when a user signs up.
 * **Document Fields:**
 * `email`: (String) User's email address.
 * `displayName`: (String) User's chosen display name.
 * `createdAt`: (Timestamp)
 * `profile`: (Map)
 * `age`: (Number)
 * `sex`: (String) "male" | "female"
 * `dietHistory`: (String) "low" | "medium" | "high" | "perpetual"
 * `metabolicAdaptationFactor`: (Number) e.g., 0.15

 * **`users/{userId}/goals/{goalId}`** (Subcollection: `goals`)

 * **Description:** Stores a user's goals. A user can have multiple goals over time, but only one is active.
 * **Document Fields:**
 * `type`: (String) "fat_loss" | "reverse_dieting" | "maintenance"
 * `isActive`: (Boolean)
 * `startDate`: (Timestamp)
 * `startWeightKg`: (Number)
 * `activePlan`: (Map) **(Denormalized Data)**
 * `caloriesTarget`: (Number)
 * `proteinTargetG`: (Number)
 * `carbsTargetG`: (Number)
 * `fatTargetG`: (Number)

 * **`users/{userId}/dailyCheckIns/{YYYY-MM-DD}`** (Subcollection: `dailyCheckIns`)

 * **Description:** Stores daily data points. The document ID is the date for easy lookups.
 * **Document Fields:**
 * `date`: (Timestamp)
 * `weightKg`: (Number)

 * **`users/{userId}/foodLogEntries/{logEntryId}`** (Subcollection: `foodLogEntries`)

 * **Description:** Stores individual food log entries for a given day.
 * **Document Fields:**
 * `date`: (Timestamp)
 * `mealName`: (String) "Breakfast", "Lunch", etc.
 * `calories`: (Number)
 * `proteinG`: (Number)
 * ...and so on.

#### 4.2 Data Flow & Rationale

 * **Denormalization:** The `activePlan` is stored directly on the `goal` document. This avoids a separate read to another collection just to display the user's primary dashboard targets. When the plan is updated, this map is overwritten. This optimizes for the most common read operation.
 * **Subcollections:** All user-specific data is stored in subcollections under their `users/{userId}` document. This allows for powerful security rules where a user can only access data paths that start with `/users/{userId}`. See §10.
 * **Schema Management:** There are no formal "migrations." Schema changes are handled in the application code. For breaking changes, a Cloud Function can be written to iterate through all documents in a collection and update their structure.