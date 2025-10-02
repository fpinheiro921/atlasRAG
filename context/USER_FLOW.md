### 5. User Flow (textual)

#### 5.1 Happy Path

1. **Landing Page:** User clicks "Get Started".
2. **Sign Up Screen:** User creates an account with email/password or Google via Firebase Authentication.
3. **Onboarding Step 1-4:** User provides goal, biometrics, history, and activity levels.
4. **Calculation:** The client calls the `calculateOnboardingPlan` Cloud Function with the user's inputs.
5. **Summary Screen:** The app displays the calculated initial targets. User clicks "Start My Plan".
6. **Database Write:** The new `goal` and `user` profile documents are created in Firestore.
7. **Dashboard:** User is taken to the main dashboard, which subscribes to their active `goal` document in real-time.
8. **Logging Weight:** User enters their weight. The data is written to the `dailyCheckIns` subcollection.
9. **Logging Food:** User logs a meal. Data is written to the `foodLogEntries` subcollection.
10. **(After 7 days) Weekly Check-in:** A client-side trigger prompts the user.
11. **Check-in Screen:** The app fetches the last 14 days of `dailyCheckIns` to calculate average weight change.
12. **Adjustment:** A Cloud Function is called to process the check-in and determine if an adjustment is needed. The `goal` document is updated in Firestore, and the change is reflected on the dashboard in real-time.