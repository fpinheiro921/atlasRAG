### 1. PRD (Product Requirements Document)

#### 1.1 Product Vision & Success Metrics

1.1.1 **One-sentence problem statement:** Aspiring health-conscious individuals lack a systematic, science-backed tool to manage their nutrition for sustainable fat loss and metabolic recovery, leaving them stuck in cycles of yo-yo dieting.
1.1.2 **KPIs:**
1.1.2.1 **North-Star KPI:** Weekly Active Users (WAU) performing at least one core action (logging weight, logging food, or completing a weekly check-in).
1.1.2.2 **Launch KPI 1 (Activation):** 75% of new users complete the full onboarding and receive their initial calorie/macro targets within 24 hours of signup.
1.1.2.3 **Launch KPI 2 (Engagement):** 40% of activated users log their body weight for at least 5 of their first 7 days.
1.1.2.4 **Launch KPI 3 (Retention):** 25% of users who complete onboarding are still active (at least one core action) in Week 4.
1.1.3 **Non-negotiable constraints:**
1.1.3.1 **Compliance:** Must be GDPR compliant, with clear user consent for health data processing. Firebase project data residency must be configured for a European region (e.g., `europe-west`) to comply.
1.1.3.2 **Performance:** Core calculations (TDEE, macros) executed via Cloud Functions must return in < 1000ms (accounting for potential cold starts). Document reads from Firestore must be < 200ms.
1.1.3.3 **SLA:** 99.5% uptime for all critical Firebase services (Auth, Firestore, Functions, Hosting).

-----

#### 1.2 Target Users & Personas

2.1.1 **Primary Persona: "Alex, The Data-Driven Achiever"**
* **Demographics:** 25-40 years old, tech-savvy professional, likely works in a role requiring analytical thinking (e.g., product manager, marketer, engineer).
* **Pains:**
* Frustrated with generic "cookie-cutter" fitness apps and meal plans.
* Has tried and failed with yo-yo dieting, suspects metabolic adaptation is an issue.
* Lacks a clear, systematic process for making adjustments when progress stalls.
* Overwhelmed by conflicting information online and wants a single source of truth based on scientific principles.
* **Goals:**
* Achieve sustainable fat loss without extreme restriction.
* Understand their own metabolism and how to manage it long-term (e.g., reverse dieting).
* Use data to make objective decisions about their diet and training.
* Feel in control of the process.
* **Tech Literacy:** High. Expects a clean, fast, and intuitive UI. Comfortable with data entry and charts.
* **Accessibility Needs:** May require high-contrast modes for viewing charts and data.
2.1.2 **Secondary Persona: "The Intermediate Lifter"**
* **Demographics:** 20-35 years old, dedicated to resistance training, has a solid understanding of basic nutrition.
* **Pains:** Has hit a plateau in body composition goals and needs a more precise methodology. Struggles with the "post-diet" phase, often regaining weight quickly.
* **Goals:** Optimize nutrition to support training performance while leaning out or transitioning to a sustainable maintenance phase.

2.2.1 **Persona-to-Feature Priority Matrix:**

| Feature | Alex (Primary) | Intermediate Lifter (Secondary) |
| --- | --- | --- |
| Onboarding & Goal Setup | High | Medium |
| TDEE Calculation (Müller) | High | High |
| Metabolic Adaptation Adjustment | High | High |
| Hierarchical Macro Allocation | High | High |
| Daily Data Tracking (Weight/Food) | High | High |
| Weekly Adjustment Engine | High | High |
| Fat Loss Plateau Management | High | High |
| Reverse Dieting Protocol | High | High |
| Resistance Training Log | Medium | High |
| Activity Monitor Integration | Medium | Medium |

-----

#### 1.3 Feature Inventory

3.1.1 **Feature: Onboarding & Calibration (F-01)**
* **Purpose:** To gather baseline user data (biometrics, diet history, goal) to generate a personalized starting nutrition plan.
* **Acceptance Criteria:**
* User can select one primary goal: Fat Loss, Reverse Dieting, or Maintenance.
* User can input age, sex, body weight, and estimated body fat %.
* User answers questions about their recent dieting history to determine a Metabolic Adaptation factor.
* The system uses these inputs to calculate and display initial TDEE and macro targets.
* **Out-of-Scope (MVP):** Body fat calculation via image upload, direct integration with smart scales.
3.1.2 **Feature: Daily Dashboard & Logging (F-02)**
* **Purpose:** To provide a central place for the user to view their daily targets and log their progress.
* **Acceptance Criteria:**
* Dashboard displays today's target calories, protein, carbs, and fats.
* User can input their daily body weight.
* User can log meals with calorie and macro breakdowns.
* App calculates and displays a 7-day rolling average of body weight.
* **Out-of-Scope (MVP):** Barcode scanning, comprehensive food database integration (e.g., Nutritionix API). Users will manually input macro totals for MVP.
3.1.3 **Feature: Weekly Check-in & Adjustment Engine (F-03)**
* **Purpose:** To automate the weekly decision-making process for adjusting macros based on progress.
* **Acceptance Criteria:**
* On a designated check-in day, the app compares the current week's average weight to the previous week's.
* For "Reverse Dieting," if weight gain is within the allowable threshold (e.g., ≤ 0.5% body weight), the app suggests a specific macro increase. If not, it advises holding steady.
* For "Fat Loss," if a plateau is detected (no weight change for 7-10 days), the app suggests a micro-adjustment (small calorie drop or activity increase).
* **Out-of-Scope (MVP):** Analysis of circumference measurements or progress photos.

3.2.1 **Prioritization (MoSCoW):**
* **Must Have:** F-01 (Onboarding), F-02 (Dashboard/Logging), F-03 (Weekly Check-in - core logic).
* **Should Have:** Integration with Apple Health / Google Fit for activity data, detailed progress charts, resistance training log.
* **Could Have:** Recipe database, community features, barcode scanner for food logging.
* **Won't Have (for now):** AI meal planning, direct coaching services.

3.3.1 **Wireframes:**
* See Figma Project: [Link to Figma frames - `figma.com/project/atlas`]

-----

#### 1.4 User Stories & Acceptance Tests

4.1.1 **Story (Alex - Onboarding):**
* **As** Alex, a data-driven achiever,
* **I want to** input my body stats, goal, and dieting history,
* **So that** I can receive a scientifically-backed, personalized starting calorie and macro plan.
4.2.1 **Acceptance Test (BDD):**
* **Feature:** F-01 Onboarding & Calibration
* **Test ID:** `AT-01.1`
* **Scenario:** Successful calculation for a user with metabolic adaptation.
* **Given** a user inputs: Weight=80kg, BF%=20%, Age=30, Sex=Male, Goal=Fat Loss, and Diet History="Spent >2/3 of year in deficit".
* **When** they complete the onboarding flow.
* **Then** the system should calculate their LBM (64kg) and FM (16kg).
* **And** calculate their Müller BMR (approx. 1828 kcal).
* **And** apply a 15% metabolic adaptation reduction to the BMR (new BMR = 1554 kcal).
* **And** calculate their TDEE using their selected activity factors.
* **And** present a final daily calorie target that is a deficit from the adjusted TDEE.

-----

#### 1.5 Roadmap & Phases

5.1.1 **Phase 0: Proof of Concept (Ends Oct 15, 2025)**
* **Owner:** Lead Dev
* **Goal:** Validate the core calculation engine within a Firebase Function.
* **Exit Criteria:** A callable Cloud Function that correctly implements the Müller equation, metabolic adaptation adjustments, and macro allocation hierarchy, tested via the Firebase Emulator Suite.
5.1.2 **Phase 1: MVP (Ends Jan 31, 2026)**
* **Owner:** Product Manager
* **Goal:** Launch a PWA on Firebase Hosting with core features for early adopters.
* **Exit Criteria:** Features F-01, F-02, and F-03 are live. Activation KPI is tracked and meets the 75% target.
5.1.3 **Phase 2: Polish & Expand (Ends Apr 30, 2026)**
* **Owner:** Product Manager
* **Goal:** Enhance the user experience and add high-value secondary features.
* **Exit Criteria:** Implement a resistance training log, progress charts, and HealthKit/Google Fit integration.

5.2.1 **Feature Flags:**
* Managed via Firebase Remote Config for dynamic, server-side control.
* `enable-reverse-dieting-v2-logic`: To test new adjustment thresholds.
* `enable-nutritionix-api`: To toggle between manual food logging and a 3rd party database.
* `enable-training-log`: To roll out the resistance training feature to a subset of users.

-----

#### 1.6 Edge Cases & Failure Modes

6.1.1 **Feature: Onboarding (F-01)**
* **Bad Input:** User enters unrealistic body fat % (e.g., 1% or 90%).
* **Detection:** Client-side validation before invoking the Cloud Function.
* **Logging:** Log a `WARN` level event to Cloud Logging with `{"event": "onboarding_validation_failed", "field": "body_fat", "value": 90, "user_id": "..."}`.
* **Fallback UX:** Display an inline error message: "Please enter a body fat percentage between 3% and 60%."
* **Failure Mode:** The `calculatePlan` Cloud Function times out or fails.
* **Detection:** Client receives an error response from the function invocation.
* **Logging:** Cloud Functions automatically logs errors to Cloud Logging. Configure alerts for high failure rates.
* **Fallback UX:** Display a modal: "We're having trouble calculating your plan right now. Please try again in a few minutes. If the problem persists, contact support."
6.1.2 **Feature: Daily Logging (F-02)**
* **Edge Case:** User tries to log data while offline.
* **Detection:** Client-side network status check. Firestore's offline persistence handles this automatically.
* **Logging:** No explicit logging needed. Firestore logs sync status to the device console.
* **Fallback UX:** The UI should feel seamless. An optional, non-intrusive toast can inform the user: "You appear to be offline. Your data has been saved locally and will sync when you reconnect."

-----

#### 1.7 Expected Outcomes

7.1.1 **Business OKR Alignment:** The app's KPIs directly support the business objective of "Achieve Product-Market Fit by validating user engagement and retention."
* **Activation Rate (75%)** proves the onboarding flow is effective and the value proposition is clear.
* **Engagement (40% log 5/7 days)** proves the core logging loop is valuable and not overly burdensome.
* **Retention (25% at W4)** proves the app delivers tangible results and becomes part of the user's routine, indicating a sticky product.
* **Error Rate:** Cloud Function execution error rate must remain ≤ 0.2%.