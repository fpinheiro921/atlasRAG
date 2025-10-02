### 2. Tech Stack Specification

#### 2.1 Stack-at-a-Glance Table

| Layer | Tool & Version | Why | Fallback |
|--- |--- |--- |--- |
| **Frontend** | TypeScript 5.4, Next.js 14 (React 18) | PWA-first, excellent dev experience, static generation for performance. | Vite + React. |
| **UI** | TailwindCSS 3.4, Radix UI | Utility-first for rapid development, Radix for headless, accessible components. | CSS Modules, Headless UI. |
| **State Mgt** | Zustand 4.5 | Simple, minimal boilerplate global state. Use `react-firebase-hooks` for server state. | React Context. |
| **Backend** | **Firebase Platform** | Fully managed, serverless platform that combines all necessary backend services. | AWS Amplify. |
| **Database** | **Cloud Firestore** | Scalable, real-time NoSQL database with powerful offline capabilities and security rules. | Realtime Database (for simpler data). |
| **Compute** | **Cloud Functions for Firebase v2** | Serverless, event-driven compute for business logic without managing servers. | - |
| **Auth** | **Firebase Authentication** | Secure, easy-to-use authentication with multiple providers (Google, email/pass). | - |
| **Hosting** | **Firebase Hosting** | Global CDN, free SSL, custom domains, and seamless integration with the Firebase ecosystem. | Vercel (requires more config for Firebase). |
| **CI/CD** | GitHub Actions | Natively integrated with the code repository for testing, building, and deploying to Firebase. | CircleCI. |
| **Observability**| **Cloud Logging, Cloud Monitoring**| Natively integrated services for logging, monitoring, and alerting on Firebase resources. | Sentry (can supplement for client-side). |

-----

#### 2.2 Frontend

2.2.1 **Language/Framework:** TypeScript `5.4.x`, Next.js `14.2.x` (App Router).
2.2.2 **Build Tool:** Next.js uses its own internal build tooling on top of Webpack/SWC.
2.2.3 **UI Layer:** TailwindCSS `3.4.x` with PostCSS. Radix UI for headless components.
2.4.4 **Firebase SDKs:**
* `firebase`: The core Firebase JS SDK.
* `react-firebase-hooks`: Simplifies connecting Firebase state to React components (e.g., `useDocumentData`, `useCollectionData`).

-----

#### 2.3 Backend

3.1 **Platform:** All backend services are provided by Google Firebase.
3.2 **Database:** Cloud Firestore will be used as the primary database. Security Rules are a critical part of the data layer. See §10.
3.3 **Compute:** Cloud Functions (v2) will be used for all server-side logic that cannot be handled by security rules or the client.
* **Runtime:** Node.js 20.
* **Example Functions:** `calculateOnboardingPlan`, `processWeeklyCheckIn`.

-----

#### 2.4 DevOps / CI-CD

4.1 **CI/CD Pipeline:** GitHub Actions will be used to automate deployment.

```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase
on:
  push:
    branches: [ "main" ]
jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_ATLAS }}'
          channelId: live
          projectId: atlas-prod
```

4.2 **Environments:** Use separate Firebase projects for `dev` and `prod` to ensure isolation. Manage configurations using `.firebaserc`.

-----

#### 2.5 Observability

5.1 **Structured Logs:** All Cloud Functions will use `firebase-functions/logger` which automatically produces structured JSON logs in Cloud Logging.
* **Log Schema:** `{"severity": "INFO", "message": "User plan calculated", "jsonPayload": {"userId": "...", "executionId": "..."}}`
* **Levels:** `DEBUG`, `INFO`, `WARN`, `ERROR`. `INFO` and above will be logged in production.
5.2 **Monitoring & Alerting:** Use Cloud Monitoring to create dashboards for function invocations, execution time, and error rates. Create alerts that trigger on high error percentages or long execution latencies.

-----

#### 2.6 Local Setup Steps

1. `git clone <repo_url>`
2. `cd atlas`
3. `npm install -g firebase-tools`
4. `npm install`
5. Authenticate with Firebase: `firebase login`
6. Initialize the Firebase Emulator Suite: `firebase init emulators` (select Auth, Functions, Firestore).
7. Start the emulators and the dev server: `firebase emulators:start --import=./seed-data & npm run dev`
8. **Common Failures:**
 * **Port Collision:** The Emulator UI and other services use common ports. Configure different ports in `firebase.json` if needed.
 * **Auth Errors:** Ensure the client-side Firebase config is pointing to the local emulators during development.