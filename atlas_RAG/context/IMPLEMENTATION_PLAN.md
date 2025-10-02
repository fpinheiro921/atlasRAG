### 8. Implementation Plan

#### 8.2 Work-Package Breakdown

| WP | Description | Owner | Estimate (dev-days) | Dep | Risk |
|--- |--- |--- |--- |--- |--- |
| **P1.1** | Setup Firebase Project, CI/CD, Emulators | DevOps | 5 | - | G |
| **P1.2** | Firestore Schema Design & Security Rules | Backend Dev | 8 | P1.1| R |
| **P1.3** | Configure Firebase Auth (FE + Rules) | Full Stack | 5 | P1.2| G |
| **P1.4** | Build UI Kit & Design System | Frontend Dev| 15 | - | G |
| **P1.5** | Implement `calculatePlan` Cloud Function | Backend Dev | 8 | P1.1| G |
| **P1.6** | Build Onboarding Flow (FE + Function Call)| Frontend Dev| 12 | P1.3, P1.4, P1.5 | A |
| **P1.7** | Build Dashboard & Logging (FE + Firestore)| Frontend Dev| 20 | P1.3, P1.4 | G |
| **P1.8** | Build Weekly Check-in (FE + Function) | Full Stack | 15 | P1.7| A |
| **P1.9** | QA & Bug Bash (using Emulators & Live) | QA | 10 | P1.8| G |

*Risk (RAG): R=Red, A=Amber, G=Green. Security rules (P1.2) are high risk because if they are wrong, the app is either insecure or non-functional.*