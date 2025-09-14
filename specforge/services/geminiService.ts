
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const MODEL_NAME = "gemini-2.5-flash";

const NEW_MASTER_SPEC_GENERATION_PROMPT = `
You are an expert in product and technical documentation for web-app development.  
Your job is to create **ALL** the following documents for this project in a single response, with zero hand-waving or skipped steps:

1. **PRD (Product Requirements Document)**
2. **Tech Stack Specification**
3. **Project Structure**
4. **Schema Design**
5. **User Flow (textual)**
6. **User Flow Flow-Chart** *(PlantUML or Mermaid source + instructions)*
7. **Backend Structure**
8. **Implementation Plan**
9. **Project Rules & Coding Standards**
10. **Security Guidelines**
11. **Styling Guidelines**

--------------------------------------------------------------------
GLOBAL INSTRUCTIONS — APPLY TO EVERY SECTION
--------------------------------------------------------------------
- **Number everything** (1, 1.1, 1.1.1…)—no skipped levels.  
- **Edge cases & failure modes:** identify bad inputs, timeouts, 3-party outages, auth lapses, etc., and spell out detection, logging schema, alerting, fallback UX.  
- **Logging & observability:** JSON log keys, log levels, correlation IDs.  
- **Error handling:** graceful degradation paths + user messaging.  
- **Sample code/pseudocode:** fenced blocks with language hints for tricky bits.  
- **Cross-references:** when one section relies on another, cite “see §X.Y”.  
- **Compliance hooks:** GDPR / HIPAA / PCI requirements if data is touched.  
- **🚨OPEN QUESTION** flag for anything that truly needs later decision.  
- Tone: blunt, precise, no marketing fluff—write for competent devs shipping real code.

--------------------------------------------------------------------
### 1. PRD (Product Requirements Document)
Start with the ultimate project goal, then go into sections for feature overviews, user stories, requirements, and phases. Number all steps. List all edge cases and error risks for each feature. Include expected user outcomes.

Product Vision & Success Metrics
1.1 One-sentence problem statement.
1.2 North-Star KPI + three launch KPIs (quantified).
1.3 Non-negotiable constraints (legal, performance, SLA).

Target Users & Personas
2.1 Primary vs secondary personas: pains, goals, tech literacy, accessibility needs.
2.2 Persona-to-feature priority matrix.

Feature Inventory
3.1 For every feature: name, purpose, acceptance criteria, clear “out-of-scope” line.
3.2 Rank via MoSCoW or RICE with numeric scores.
3.3 Link to wireframes or Figma frames.

User Stories & Acceptance Tests
4.1 GIVEN-WHEN-THEN stories for each persona.
4.2 BDD-style acceptance scenarios tied to automated test IDs.

Roadmap & Phases
5.1 Phase 0 POC → Phase 1 MVP → Phase 2 polish; include dates, owners, exit criteria.
5.2 Feature flags list for staged releases.

Edge Cases & Failure Modes
6.1 Enumerate bad inputs, latency spikes, auth lapses, third-party outages.
6.2 Describe graceful degradation and fallback UI for each.

Expected Outcomes
7.1 Tie KPIs to business OKRs; define “success” numerically (e.g., ≤ 1% error rate).

--------------------------------------------------------------------
### 2. Tech Stack Specification — Every tool, pinned and justified
Explicitly list every language, library, framework, service, or 3rd party tool required. Justify each choice. Detail versioning, setup instructions, and fallback options. Include error handling and logging at the stack level.

Stack-at-a-Glance Table

Layer	Tool & Version	Why	Fallback

Frontend
2.1 Language/framework (e.g., TypeScript 5 + React 19).
2.2 Build tool (Vite) and exact config snippet.
2.3 UI layer (TailwindCSS v4) with PostCSS pipeline.
2.4 Error boundaries and client-side logging (Sentry).

Backend
3.1 Runtime (Node 20 or Deno 1.45).
3.2 Framework (NestJS 10) with sample module skeleton.
3.3 DB (Postgres 16.1) + ORM (Prisma 5) settings, connection pool limits.
3.4 Cache (Redis 7) eviction policy.

DevOps / CI-CD
4.1 Dockerfile (multi-stage), docker-compose for local.
4.2 GitHub Actions YAML showing test → build → deploy.
4.3 Helm chart outline for K8s.

Observability
5.1 Structured logs (JSON Lines), log levels, correlation IDs.
5.2 Metrics via OpenTelemetry; sample Grafana dashboard.
5.3 Alert thresholds and pager escalation.

Security & Compliance
6.1 OWASP checklist mapping; CSP headers, rate limits.
6.2 Dependency scanning cadence (Snyk, Dependabot).
6.3 Secrets handling (Vault/KMS), rotation policy.

Local Setup Steps
7.1 Numbered CLI from git clone to npm run dev.
7.2 Common failures and fixes (e.g., SSL cert issues, port collisions).

--------------------------------------------------------------------
### 3. Project Structure
Map out the exact folder/file architecture. Name every directory, subdirectory, and major file. Describe what each contains. Provide a sample tree. Number steps for setup and changes. List risks and edge cases from misorganization.

Directory Tree (real tree -L 2)

css
Copiar
app/
  src/
    components/
    pages/
    hooks/
  prisma/
    migrations/
  scripts/
  tests/
Folder Contracts

components/ → pure, stateless UI only.

pages/ → Next.js route files, no business logic.

hooks/ → shared logic; any side-effects must be logged.

scripts/ → one-off CLI tools; require reviewer sign-off before merging.

Code Ownership Map
YAML file mapping glob patterns → GitHub teams.

Bootstrap Script
./scripts/bootstrap.sh to install Git hooks, env files, Husky, lint-staged.

Risks & Edge Cases

Cyclic imports: detect with ESLint plugin.

Monolith-growing folders: size threshold alerts.

Misplaced tests: CI fails if test not colocated.

--------------------------------------------------------------------
### 4. Schema Design — Data model that won’t bite you later
Draw or describe all database schemas. For each table/model: field names, types, relations, validations. Add migration strategy, seed data, and integrity checks. Explain how data flows and where things can break.

ER Diagram
Provide PlantUML or DBML file plus rendered PNG.

Table Specs (repeat per table)

id (UUID, PK)

created_at (TIMESTAMP WITH TIME ZONE, default now())

All other fields: type, nullable?, unique?, index?, description.

Validation rules (length, regex).

Relationships & Cascades
FK actions (RESTRICT vs CASCADE).
Denormalisation choices with rationale.

Migrations

Numbered SQL files, always reversible.

Sample prisma migrate dev command.

Rollback SOP.

Seed & Fixture Data

Idempotent seeds for local dev.

Redacted production snapshot for staging tests.

Data Flow & Breakdown Points

Diagram insert/update/read path.

Failure hooks: dead-letter queues, retry logic.

--------------------------------------------------------------------
### 5. User Flow (textual) — Pixel-exact path the user walks
Describe the end-to-end user journey with all decision points, screens, and possible paths. Use numbered flow steps and bullet lists for options/branches. Highlight error scenarios, and explain UX logging and feedback.

Happy Path
1.1 Step-by-step numbered screens from landing → onboarding → core action → logout.
1.2 Inline decision diamonds (yes/no) for key branches.

Alternate & Error Paths
2.1 Auth failure, network timeout, 3rd-party API down.
2.2 Recovery UX: retry, cached data, offline notice.

State Machine
Table of states, allowed events, resulting state; ensures predictable UI.

Instrumentation & Analytics

Event names (app.signup_success), payload schema, sampling rate.

Tag each event to product KPI.

UX Feedback & Accessibility

Toast vs modal decision matrix.

Live-region updates; focus management rules after navigation.

Logging Hooks

Console → wrapped logger; obfuscate PII.

Correlate frontend request ID with backend trace ID.

--------------------------------------------------------------------
### 6. User Flow **Flow-Chart**
1. **Diagram Source** – provide a full **PlantUML or Mermaid** block capturing every step/decision from §5.  
2. **Legend** – 3-line key explaining symbols; error branches in **red**.  
3. **Render Hint** – command snippet: \\\`plantuml flow.puml\\\` or \\\`npx @mermaid-js/mermaid-cli -i flow.mmd -o flow.svg\\\`.  
4. **Edge-Case Callouts** – annotate where retries, auth redirects, or offline banners trigger.  
5. **Cross-Ref** – link each node ID to the corresponding textual step in §5.

--------------------------------------------------------------------
### 7. Backend Structure — Server-side architecture deep dive
1. **High-Level Diagram** – services, DB, cache, message bus, ops tooling.  
2. **Service Breakdown**  
   2.1 API Gateway → auth → micro-services.  
   2.2 Interface contracts (OpenAPI excerpt per service).  
   2.3 Expected latencies + SLA budgets.  
3. **Folder Tree (\`/services\`)** – sample layout two levels deep per micro-service.  
4. **Data Layer**  
   4.1 Connection pools, replica lag budget, sharding or partition key choice.  
   4.2 Fail-over and disaster-recovery steps (RPO, RTO).  
5. **Edge Cases & Failure Modes**  
   5.1 Thundering-herd / cache stampede.  
   5.2 Network partition / split-brain.  
   5.3 Mitigation scripts and circuit-breaker patterns.  
6. **Observability Hooks** – tracing spans, RED metrics, alert thresholds.  
7. **Security Touchpoints** – service-to-service mTLS, least-priv DB creds.

--------------------------------------------------------------------
### 8. Implementation Plan — From zero to GA
1. **Phase Timeline** – Gantt-style table: POC → MVP → Beta → GA.  
2. **Work-Package Breakdown**  
   | WP | Description | Owner | Estimate (dev-days) | Dep | Risk (RAG) |  
   |----|-------------|-------|---------------------|-----|------------|  
3. **Critical Path & Slack** – arrow diagram + narrative.  
4. **Resource Allocation** – devs, QA, UX, DevOps; % allocation per phase.  
5. **Go/No-Go Criteria** – quantified thresholds, rollback triggers, comms plan.  
6. **Edge-Case Drills** – what happens if a milestone slips or a dependency fails.  
7. **Cross-Ref** – tie tasks back to specs in §§3–7.

--------------------------------------------------------------------
### 9. Project Rules & Coding Standards
1. **Commit Hygiene** – Conventional Commits, max 400 LOC per PR, signed commits.  
2. **Branching Model** – GitFlow vs trunk-based diagram with example branch names.  
3. **Lint / Format** – ESLint, Prettier, stylelint, husky + lint-staged sample config.  
4. **Review Checklist** – tests exist, logs added, perf impact, security review.  
5. **CI Gates** – unit, e2e, lint, SCA, bundle-size guard.  
6. **Definition of Done** – mandatory criteria before merge.  
7. **Edge-Case Policies** – hotfix flow, revert strategy, large-file handling.  
8. **Cross-Ref** – reference §8 Implementation Plan milestones that rely on these rules.

--------------------------------------------------------------------
### 10. Security Guidelines
1. **Threat Model (STRIDE)** – table: asset → threat → severity → control.  
2. **AuthN/AuthZ**  
   2.1 OAuth2 / OIDC sequence diagram.  
   2.2 RBAC matrix: role → allowed actions.  
3. **Data Protection** – TLS 1.3, AES-256 at rest, key rotation SOP, secrets vault.  
4. **Secure-Coding Checklist** – SQLi, XSS, CSRF, SSRF, open-redirect.  
5. **Audit & Monitoring** – log schema, retention policy, anomaly thresholds.  
6. **Compliance Workflows** – GDPR DSAR flow, HIPAA logging, ISO-27001 mapping.  
7. **Incident Response** – severity levels, on-call rotation, comms templates.  
8. **Cross-Ref** – see §7.5 for service-layer security hooks.

--------------------------------------------------------------------
### 11. Styling Guidelines — Make it look pro and on-brand
1. **Design System & Brand Personality**
   1.1 State the brand’s core traits (e.g., trustworthy fintech, playful ed-tech, clinical healthcare).
   1.2 Translate those traits into **design tokens**: primary/secondary colors, neutral palette, success/warning/error, typography scale, spacing units, radii, shadows, motion durations.
   1.3 Save tokens as CSS variables / Tailwind \\\`theme.extend\\\` for easy theming and white-labeling.

2. **Theme Logic & Adaptability**
   2.1 Provide light + dark modes out of the box; switch via prefers-color-scheme + runtime toggle.
   2.2 Outline how to swap token sets to realign the style with a different product goal (e.g., re-skin “clinical” to “consumer wellness”—just change token JSON, zero code changes).
   2.3 Document a color-contrast matrix; flag any combo < 4.5:1 (WCAG AA).

3. **Layout & Responsiveness**
   3.1 Grid/Flex strategy: mobile-first, 4 breakpoints (sm 640, md 768, lg 1024, xl 1280).
   3.2 Define max-width containers, fluid columns, safe-area padding.
   3.3 List edge cases: long strings, RTL text, 320 px screens, landscape tablets.

4. **Component Library (Atomic → Page)**
   4.1 Atoms: buttons, inputs, icons—state specs (default, hover, active, disabled, loading, error).
   4.2 Molecules: form groups, card, modal; detail keyboard focus rings & ARIA.
   4.3 Organisms: nav bar, dashboard widget, data table—slot layouts and scroll behavior.
   4.4 Provide Tailwind/SCSS snippets for each, plus Figma links or screenshots.
   4.5 Specify animation guidance: purpose-driven only (200 ms ease-out max), reduce-motion fallback.

5. **Accessibility & UX Safeguards**
   5.1 Hit WCAG 2.2 AA: color contrast, focus order, role labels, semantic HTML.
   5.2 Define text sizes with \\\`rem\\\` scale (1 rem = 16 px) and allow browser zoom up to 200 %.
   5.3 Describe alt-text rule set, live-region use for async updates, and screen-reader test checklist.

6. **Error / Empty / Loading States**
   6.1 Show visual hierarchy: icon → title → concise message → primary action.
   6.2 Give styling rules for skeleton loaders vs activity spinners; auto-fade after success.
   6.3 Specify color & tone alignment with brand personality (e.g., finance errors = calm reds, health warnings = amber).

7. **Quality Gates & Tooling**
   7.1 Lint styles with Stylelint + custom plugin blocking non-token colors.
   7.2 Automated visual regression (Chromatic / Playwright-Trace).
   7.3 Browser-matrix checklist: Chrome, Safari, Firefox (current-1), Edge, iOS/Android WebView.

8. **Sample Code Snippet**

\`\`\`css
/* Tailwind config extract */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'var(--color-brand-500)',
          50:  'var(--color-brand-50)',
          900: 'var(--color-brand-900)',
        },
      },
      borderRadius: {
        card: 'var(--radius-card, 1rem)',
      },
    },
  },
};
\`\`\`

\`\`\`tsx
/* React Button example */
export function Button({ variant = 'primary', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-card transition-shadow focus:outline-none focus-visible:ring';
  const styles = {
    primary:  'bg-brand text-white hover:bg-brand-900',
    secondary:'bg-white text-brand border border-brand hover:bg-brand-50',
    danger:   'bg-red-600 text-white hover:bg-red-700',
  };
  return <button className={base + ' ' + styles[variant]} {...props} />;
}
\`\`\`

9. **Cross-References**

   * **Tech Stack Spec** → lists Tailwind/SASS versions and PostCSS pipeline.
   * **Project Structure** → \`/styles/tokens\`, \`/components/ui\`.
   * **User Flow** → references empty/error/loading visuals for each step.

*Deliverables from this section must be production-ready: copy-pasteable config files, component snippets, and an accessible, goal-aligned design system that any competent dev can implement without asking follow-up questions.*

--------------------------------------------------------------------
**END OF PROMPT — AI SHOULD NOW OUTPUT THE FULL DOCUMENT FOLLOWING THESE INSTRUCTIONS**
`;


const CONCEPT_EXPANSION_PROMPT = `
You are an expert Product Manager and a 10x Principal Engineer rolled into one. You have an elite ability to take a vague, high-level concept and instantly envision a clear, actionable path to a viable Minimum Viable Product (MVP).

Your sole task is to take the user's one-sentence app idea provided at the end of this prompt and immediately expand it into a comprehensive and opinionated **"Refined Project Brief."** This brief must be complete and detailed enough to be used as the direct input for a subsequent, exhaustive documentation generation process.

**CRITICAL RULES:**

1.  **NO QUESTIONS:** Do not ask for clarification. Your value is in making intelligent, industry-standard assumptions and creating a complete, production-ready brief from minimal input.
2.  **BE OPINIONATED & SPECIFIC:** Make concrete, logical choices. Invent names for the app and its personas. Define specific, numbered KPIs. List exact features. Do not provide options or ranges; provide a single, coherent vision for the MVP.
3.  **SCOPE FOR AN MVP:** Your default stance is to build a lean, focused MVP. Aggressively define what is essential for a first launch and explicitly list what is out of scope. Think "startup," not "enterprise suite."
4.  **INFER AND INVENT:** Based on the one-sentence idea, you must infer the target audience, their primary pain points, the core data model (entities), a logical monetization strategy, and a suitable brand personality. Fill in all the blanks.
5.  **USE THE EXACT OUTPUT FORMAT:** The final output must be a single markdown block with the precise structure defined below.

### **OUTPUT FORMAT**

\`\`\`markdown
### **Refined Project Brief**

**1. Product Vision & Goal:**
* **Product Name:** [Invent a plausible, catchy name for the app.]
* **Problem Statement:** [Infer and state the core problem for the target user in a single, clear sentence.]
* **Solution/Value Prop:** [Describe how the app uniquely solves this problem in a single sentence.]
* **North-Star KPI:** [Define the single most important metric for long-term success, e.g., "Weekly Active Projects," "Revenue Per User."]
* **Launch KPIs:**
    * [Quantified KPI 1, e.g., "Achieve 500 Weekly Active Users within 8 weeks of launch."]
    * [Quantified KPI 2, e.g., "User-to-Core-Action conversion rate > 15%."]
    * [Quantified KPI 3, e.g., "Average user session time > 5 minutes."]

**2. Target Users & Personas:**
* **Primary Persona:**
    * **Name:** [Invent a descriptive name, e.g., "Stressed Small Business Owner," "Freelance Graphic Designer," "Busy Graduate Student."]
    * **Pains:** [List 2-3 specific, inferred frustrations this persona faces.]
    * **Goals:** [List 2-3 specific outcomes this persona wants to achieve by using the app.]
* **Secondary Persona:**
    * **Name:** [Invent a secondary user, e.g., "The Client," "The Team Member," "The Professor."]
    * **Pains:** [List 2-3 pains relevant to their role.]
    * **Goals:** [List 2-3 goals relevant to their role.]

**3. Core Features (MVP Scope):**
* **MUST-HAVE 1 (Core Action):** [Feature Name, e.g., "Secure User Authentication (OAuth + Email)"]. **Description:** [Briefly describe what it does and why it's essential.]
* **MUST-HAVE 2:** [Feature Name]. **Description:** [Description].
* **MUST-HAVE 3:** [Feature Name]. **Description:** [Description].
* **MUST-HAVE 4:** [Feature Name]. **Description:** [Description].
* **EXPLICITLY OUT OF SCOPE (for MVP):**
    * [A feature that is a logical but non-essential next step, e.g., "Admin Analytics Dashboard."]
    * [A feature that adds complexity, e.g., "Real-time collaboration/chat."]
    * [A feature for power-users, e.g., "Third-party integrations (API)."]

**4. Key Entities & Data Model:**
* **Core Objects:** [List the main "nouns" of the app, e.g., \`User\`, \`Workspace\`, \`Document\`, \`Comment\`, \`Tag\`.]
* **Key Relationships:** [Describe the most critical connections, e.g., "A \`User\` owns a \`Workspace\`. A \`Workspace\` has many \`Documents\`. \`Users\` can be invited to \`Documents\` where they can leave \`Comments\`."]

**5. Technical & Design Assumptions:**
* **Monetization Strategy:** [Choose a single, logical strategy, e.g., "Freemium with a single paid tier ('Pro') unlocking advanced features," "Per-seat SaaS subscription for teams," "Transactional fee on marketplace sales."]
* **Data Sensitivity:** [Choose a level: "Low (public/non-sensitive data)", "Medium (Standard PII requiring GDPR compliance)", or "High (Financial/Health data requiring PCI/HIPAA compliance)."]
* **Brand Personality / Style:** [Provide 3-4 keywords to guide design, e.g., "Clean, minimalist, professional, trustworthy," or "Vibrant, friendly, encouraging, simple."]
\`\`\`

**USER INPUT:**
`;

export const expandConceptFromIdea = async (
  ideaText: string,
  onChunkReceived?: (chunk: string) => void
): Promise<string> => {
  const apiKey = import.meta.env.VITE_API_KEY;

  if (!apiKey) {
    console.error("FATAL: Gemini API key is missing in environment variables (VITE_API_KEY). This is a deployment configuration issue.");
    throw new Error("The AI service is not configured correctly. Please try again later.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const fullPrompt = CONCEPT_EXPANSION_PROMPT + ideaText;

  try {
    console.log("Expanding concept from idea using concept expansion prompt...");

    if (onChunkReceived) {
      const stream = await ai.models.generateContentStream({
          model: MODEL_NAME,
          contents: fullPrompt,
      });

      let accumulatedText = "";
      for await (const chunk of stream) {
        const chunkText = chunk.text;
        if (typeof chunkText === 'string') {
          accumulatedText += chunkText;
          onChunkReceived(chunkText);
        }
      }

      if (!accumulatedText.trim()) {
          console.warn("Stream finished but accumulated text is empty. The AI might have returned an empty response.");
      }

      console.log("Concept expansion stream completed.");
      return accumulatedText;
    } else {
      const result = await ai.models.generateContent({
          model: MODEL_NAME,
          contents: fullPrompt,
      });

      const resultText = result.text;
      if (typeof resultText !== 'string' || !resultText.trim()) {
        console.error("Unexpected response format or empty result from Gemini API:", result);
        throw new Error("Received an unexpected or empty response from the AI for concept expansion.");
      }

      console.log("Concept expansion completed.");
      return resultText;
    }

  } catch (error) {
    console.error('Error interacting with Gemini API during concept expansion:', error);
    throw new Error("An error occurred while communicating with the AI service. Please try again.");
  }
};

export const generateSpecFromRefinedBrief = async (
  refinedBrief: string,
  selectedModuleIds: string[],
  onChunkReceived: (chunk: string) => void
): Promise<string> => {
  const apiKey = import.meta.env.VITE_API_KEY;

  if (!apiKey) {
    console.error("FATAL: Gemini API key is missing in environment variables (VITE_API_KEY). This is a deployment configuration issue.");
    throw new Error("The AI service is not configured correctly. Please try again later.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Create a filtered version of the prompt based on selected modules
  const moduleMap = {
    'prd': '1. **PRD (Product Requirements Document)**',
    'tech_stack': '2. **Tech Stack Specification**',
    'project_structure': '3. **Project Structure**',
    'schema_design': '4. **Schema Design**',
    'user_flow_textual': '5. **User Flow (textual)**',
    'user_flow_chart': '6. **User Flow Flow-Chart**',
    'backend_structure': '7. **Backend Structure**',
    'implementation_plan': '8. **Implementation Plan**',
    'project_rules': '9. **Project Rules & Coding Standards**',
    'security_guidelines': '10. **Security Guidelines**',
    'styling_guidelines': '11. **Styling Guidelines**'
  };

  // Build the list of selected modules for the prompt
  const selectedModulesList = selectedModuleIds
    .filter(id => moduleMap[id as keyof typeof moduleMap])
    .map(id => moduleMap[id as keyof typeof moduleMap])
    .join('\n');

  const filteredPrompt = NEW_MASTER_SPEC_GENERATION_PROMPT.replace(
    /1\. \*\*PRD.*?11\. \*\*Styling Guidelines\*\*/s,
    selectedModulesList
  );

  // The refined brief is prepended to the master prompt as context.
  const fullPrompt = `
Based on the following refined project brief, please generate the comprehensive documentation as described in the subsequent instructions:

--- REFINED PROJECT BRIEF START ---
${refinedBrief}
--- REFINED PROJECT BRIEF END ---

${filteredPrompt}
  `;

  try {
    console.log("Generating full specification from refined brief using the master prompt (streaming)...");

    const stream = await ai.models.generateContentStream({
        model: MODEL_NAME,
        contents: fullPrompt,
    });

    let accumulatedText = "";
    for await (const chunk of stream) {
      const chunkText = chunk.text;
      if (typeof chunkText === 'string') {
        accumulatedText += chunkText;
        onChunkReceived(chunkText);
      }
    }

    if (!accumulatedText.trim()) {
        console.warn("Stream finished but accumulated text is empty. The AI might have returned an empty response.");
    }

    console.log("Full specification stream completed.");
    return accumulatedText;

  } catch (error) {
    console.error('Error interacting with Gemini API:', error);
    // Generic error for the user. Specifics are logged to the console for the developer.
    throw new Error("An error occurred while communicating with the AI service. Please try again.");
  }
};

export const generateSpecFromIdea = async (
  ideaText: string,
  selectedModuleIds: string[],
  onChunkReceived: (chunk: string) => void,
  onConceptExpansionChunkReceived?: (chunk: string) => void,
  onConceptExpansionComplete?: (refinedBrief: string) => void
): Promise<string> => {
  console.log("Starting two-step process: concept expansion followed by spec generation...");

  // Step 1: Expand the concept
  const refinedBrief = await expandConceptFromIdea(ideaText, onConceptExpansionChunkReceived);

  if (onConceptExpansionComplete) {
    onConceptExpansionComplete(refinedBrief);
  }

  // Step 2: Generate the specification from the refined brief
  return await generateSpecFromRefinedBrief(refinedBrief, selectedModuleIds, onChunkReceived);
};

export const elaborateOnSection = async (sectionContent: string, userQuestion: string): Promise<string> => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) {
    throw new Error("The AI service is temporarily unavailable. Please try again later.");
  }
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
Based on the following document section:
--- DOCUMENT SECTION START ---
${sectionContent}
--- DOCUMENT SECTION END ---

Please address the following question or request for elaboration:
"${userQuestion}"

Provide a concise, focused, and helpful response in Markdown format.
If the question is unclear or cannot be answered based *solely* on the provided section, please state that clearly.
Do not refer to yourself as an AI in the response. Just provide the information directly.
Format your response using Markdown. For example, use headings, lists, bold text, etc., where appropriate for clarity.
`;

  try {
    console.log("Elaboration: Sending request to Gemini...");
    const result: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    
    const elaborationText = result.text;
    if (typeof elaborationText !== 'string' || !elaborationText.trim()) {
      console.error("Unexpected response format or empty elaboration from Gemini API:", result);
      throw new Error("Received an unexpected or empty response from the AI for elaboration.");
    }
    console.log("Elaboration: Received successfully.");
    return elaborationText;

  } catch (error: any) {
    console.error('Error elaborating with Gemini API:', error);
    throw new Error(`Failed to get elaboration from the AI service. Please try again.`);
  }
};

export const analyzeSpecification = async (fullSpecContent: string): Promise<string> => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) {
    throw new Error("The AI service is temporarily unavailable. Please try again later.");
  }
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
You are an expert technical reviewer and documentation analyst.
Your task is to analyze the following technical specification document. Please review it carefully and provide feedback to help improve its clarity, completeness, and consistency.

--- BEGIN DOCUMENT ---
${fullSpecContent}
--- END DOCUMENT ---

Based on your analysis, please provide suggestions covering the following areas:

### 1. Potential Ambiguities
Identify any statements, requirements, or descriptions that are unclear, open to multiple interpretations, or could lead to confusion. For each, briefly explain the ambiguity.

### 2. Areas Needing More Detail
Point out sections, features, or requirements that would benefit from further elaboration, more specific examples, or deeper explanation to ensure comprehensive understanding.

### 3. Missing Edge Cases or Scenarios
Based on the described features and user flows, identify any potential edge cases, error conditions, or alternative user scenarios that might not have been considered or explicitly addressed.

### 4. Potential Contradictions or Inconsistencies
Highlight any information or requirements across different parts of the specification that appear to contradict each other or are inconsistent.

### 5. General Recommendations (Optional)
If you have any other general recommendations for improving the overall quality of this specification, please include them here.

Format your entire response as a single Markdown document. Use the headings provided above for each section of your analysis. If you have no suggestions for a particular category, state "No specific issues identified in this category." or similar.
Focus on actionable feedback. Ensure your response is comprehensive and directly addresses the content of the provided document.

IMPORTANT: For each specific point you make under "### 1. Potential Ambiguities" and "### 2. Areas Needing More Detail":
- If your point refers to a specific section from the original document, please explicitly state its title using the format: "(Refers to section: 'SECTION_TITLE')". The SECTION_TITLE should be the exact text of the section heading as it appears in the document (e.g., '1. PRD (Product Requirements Document)', '3. Project Structure'). This linking is crucial.
- If your point refers to a specific phrase or sentence not tied to a heading, you can optionally state: "(Refers to text starting with: 'FIRST_FEW_WORDS_OF_PHRASE...')".
`;

  try {
    console.log("Spec Analysis: Sending request to Gemini...");
    const result: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    
    const analysisText = result.text;
    if (typeof analysisText !== 'string' || !analysisText.trim()) {
      console.error("Unexpected response format or empty analysis from Gemini API:", result);
      throw new Error("Received an unexpected or empty response from the AI for specification analysis.");
    }
    console.log("Spec Analysis: Received successfully.");
    return analysisText;

  } catch (error: any) {
    console.error('Error analyzing specification with Gemini API:', error);
    throw new Error(`Failed to get specification analysis from the AI service. Please try again.`);
  }
};

export const regenerateSection = async (
  sectionTitle: string, 
  originalSectionContent: string, 
  userInstructions?: string
): Promise<string> => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) {
    throw new Error("The AI service is temporarily unavailable. Please try again later.");
  }
  const ai = new GoogleGenAI({ apiKey });

  const headingMatch = originalSectionContent.match(/^(###\\s*\\d*\\.?\\s*.*?)\\n/);
  const exactHeading = headingMatch ? headingMatch[1] : `### ${sectionTitle}`;

  const prompt = `
You are an expert technical writer, skilled at revising and improving documentation sections.
You will be given the title of a document section, its original content, and optional user instructions for regeneration.
Your task is to regenerate the content for THIS SECTION ONLY.

The regenerated section MUST:
1.  Address the same topic as the original section.
2.  Incorporate any user instructions provided. If no instructions are given, attempt to rephrase, clarify, or provide an alternative perspective on the original content while maintaining its core purpose and level of detail.
3.  Start with the EXACT SAME HEADING line as the original section. The required heading is: "${exactHeading}". Do NOT change this heading line in any way.
4.  Output ONLY the content for this section, beginning with the heading "${exactHeading}". Do not include any introductory phrases like "Here is the regenerated section:", "Certainly, here's the updated section:", or any content from other sections.

Original Section Heading to be used:
${exactHeading}

Original Full Section Content (for context only, do not repeat unless necessary for the new content):
--- ORIGINAL SECTION CONTENT START ---
${originalSectionContent}
--- ORIGINAL SECTION CONTENT END ---

User Instructions for Regeneration (if any):
${userInstructions || "No specific instructions provided. Please regenerate the section based on the original content, aiming for clarity, completeness, and adherence to the original section's purpose."}

Now, regenerate ONLY this section's content, starting with the heading line: "${exactHeading}"
(The response should directly begin with "${exactHeading}")
`;

  try {
    console.log("Regenerate Section: Sending request to Gemini...");
    const result: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    
    const regeneratedText = result.text;

    if (typeof regeneratedText !== 'string' || !regeneratedText.trim()) {
      console.error("Unexpected response format or empty regeneration from Gemini API:", result);
      throw new Error("Received an unexpected or empty response from the AI for section regeneration.");
    }
    
    const trimmedOriginalResponse = regeneratedText.trim();

    if (trimmedOriginalResponse.startsWith(exactHeading)) {
        console.log("Regenerate Section: Received successfully (heading was correct).");
        return trimmedOriginalResponse;
    } else {
        console.warn(`Regenerated section content did not start with the expected heading. Expected: "${exactHeading}". Got: "${trimmedOriginalResponse.substring(0, Math.min(trimmedOriginalResponse.length, exactHeading.length + 50))}...". Correcting.`);
        
        let contentToCorrect = trimmedOriginalResponse;
        // Regex to match a markdown H3 heading (e.g., "### Some Title\\n") at the beginning of the string.
        const potentialAiHeadingRegex = /^(###\\s*.*?)(\\n|$)/; 
        
        if (potentialAiHeadingRegex.test(contentToCorrect)) {
            // If the AI included its own attempt at an H3 heading, remove it before prepending the correct one.
            // This replaces the first line if it looks like an H3 heading.
            contentToCorrect = contentToCorrect.replace(potentialAiHeadingRegex, "").trimStart();
        }
        
        // Prepend the official, exact heading.
        const correctedContent = `${exactHeading}\n${contentToCorrect}`;
        console.log("Regenerate Section: Received successfully (heading corrected).");
        return correctedContent;
    }

  } catch (error: any) {
    console.error('Error regenerating section with Gemini API:', error);
    throw new Error(`Failed to regenerate section from the AI service. Please try again.`);
  }
};
