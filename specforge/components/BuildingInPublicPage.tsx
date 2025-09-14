
import React from 'react';
import { Step1Visual } from './guide/Step1Visual';
import { Step2Visual } from './guide/Step2Visual';
import { Step3Visual } from './guide/Step3Visual';
import { Step4Visual } from './guide/Step4Visual';

const Section: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="py-8 md:py-12 border-b border-panel">
        <div className="prose-custom max-w-none text-lg">
            {children}
        </div>
    </div>
);

const Step: React.FC<{ title: string; visual: React.ReactNode; children: React.ReactNode }> = ({ title, visual, children }) => (
    <div className="mt-8 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="prose-custom max-w-none">
            <h3 className="text-2xl font-bold text-text-heading mb-4 font-display">{title}</h3>
            {children}
        </div>
        <div className="transform transition-transform duration-300 hover:scale-105">
            {visual}
        </div>
    </div>
);

const FaqItem: React.FC<{ question: string; children: React.ReactNode }> = ({ question, children }) => (
    <div className="py-4">
        <h4 className="font-bold text-text-heading text-lg">{question}</h4>
        <div className="prose-custom max-w-none text-text-muted mt-2">{children}</div>
    </div>
);


export const BuildingInPublicPage: React.FC<{onGetStarted: () => void}> = ({onGetStarted}) => {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <header className="text-center pb-12 border-b border-panel">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-text-heading mb-4 font-display">
          How to Write a Tech Spec (That Developers Will Actually Read)
        </h1>
      </header>

      <main>
        <Section>
            <h2 className="text-3xl font-bold text-text-heading mb-4 font-display">Introduction</h2>
            <p>Is the thought of writing a tech spec a source of anxiety? You have a crystal-clear vision for an app in your head, but translating it for a developer feels like trying to write in a foreign language. You know you need a plan, but you're a visionary, not a technical writer.</p>
            <p>This feeling is incredibly common, and it's where great ideas stall. Without a clear spec, you risk miscommunication, wasted development cycles, and building the wrong product entirely.</p>
            <p>This guide will demystify the process. I'm going to walk you through, step-by-step, how to build a simple but effective technical specification using nothing but a standard word processor. No confusing jargon. Just a clear framework to get your project started on the right foot.</p>
        </Section>
        
        <section className="py-8 md:py-12 border-b border-panel">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-heading mb-6 text-center font-display">The Manual Solution</h2>
            
            <Step title="Step 1: Create the One-Pager" visual={<Step1Visual />}>
                <p>From my experience, the first thing you need to do is establish the core mission. This is your North Star. <strong>Open</strong> a new document and answer these three questions as concisely as possible: What is the Product Name? What is the One-Sentence Goal? And who is the Primary User?</p>
                <blockquote>Be ruthless here. Every developer I've worked with appreciates this high-level clarity before anything else.</blockquote>
            </Step>

            <Step title="Step 2: Define Users and Their Stories" visual={<Step2Visual />}>
                <p>Now, let's flesh out who you're building for. <strong>Create</strong> a new heading and write 1-2 User Personas. Next, for each persona, <strong>write</strong> a few "User Stories" in the GIVEN-WHEN-THEN format. This forces you to think through the actual functionality from a user's perspective.</p>
            </Step>

            <Step title="Step 3: Prioritize Features with MoSCoW" visual={<Step3Visual />}>
                <p>You can't build everything at once. The next thing you'll want to do is <strong>create</strong> four lists for your features: Must-Have, Should-Have, Could-Have, and Won't-Have. This is the single best way to prevent scope creep.</p>
                <p>As you can see, manually categorizing every single feature idea can be time-consuming, and it's easy to second-guess your priorities. It's worth noting that tools like <strong>SpecForge</strong> can analyze your core idea and suggest a prioritized feature list automatically, which prevents common errors and saves considerable time.</p>
            </Step>

            <Step title="Step 4: Sketch Your Basic Data Model" visual={<Step4Visual />}>
                <p>You don't need to be a database architect. Just <strong>think</strong> about the main "things" your app needs to track (e.g., `User`, `Project`). For each one, <strong>list</strong> the pieces of information it needs. This simple step is a massive head start for your developer.</p>
            </Step>
        </section>

        <Section>
            <div className="bg-panel p-8 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold text-text-heading mb-4 text-center font-display">A More Powerful Way to Write Your Spec</h2>
                <p className="text-center mb-6">The manual system above works, but it demands consistent discipline and covers only the basics. For those who prefer an automated 'fire-and-forget' solution, there's <strong>SpecForge</strong>.</p>
                <p className="text-center mb-6">Instead of you manually trying to remember all the crucial sections a professional spec needs, our app does the heavy lifting for you. SpecForge is superior because it delivers:</p>
                <ul className="list-disc list-inside space-y-2 mb-8 mx-auto max-w-md">
                    <li><strong>Speed:</strong> Go from a raw idea to a comprehensive 11-part technical specification in under five minutes.</li>
                    <li><strong>Completeness:</strong> It generates sections you might forget, like Security Guidelines, an Implementation Plan, and User Flow diagrams.</li>
                    <li><strong>Intelligence:</strong> Use AI-powered tools to analyze your spec for ambiguities, elaborate on complex sections, or regenerate parts with new instructions.</li>
                </ul>
                <div className="text-center">
                    <button
                        onClick={onGetStarted}
                        className="bg-accent text-white font-semibold rounded-lg px-8 py-3 text-lg hover:bg-accent-dark focus:outline-none focus:ring-4 focus:ring-accent/50 transition-all duration-150 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-accent/40"
                    >
                        Take control. Forge Your First Spec for Free.
                    </button>
                </div>
            </div>
        </Section>
        
        <section className="py-8 md:py-12 border-b border-panel">
            <h2 className="text-3xl font-bold text-text-heading mb-2 text-center font-display">Frequently Asked Questions</h2>
            <div className="divide-y divide-panel">
                <FaqItem question="Is a simple spec made in a Google Doc enough?">
                    <p>It's a great start and far better than nothing! However, a simple document often misses critical sections that developers need, like error handling, security considerations, or a detailed implementation plan. This can lead to guesswork and costly mistakes down the line.</p>
                </FaqItem>
                <FaqItem question="What if I don't know what technical details to include?">
                    <p>This is the primary risk of the DIY method and exactly the problem SpecForge is designed to solve. Our AI is trained on best practices for technical documentation, so it automatically includes the details developers look for, even if you don't know to ask for them.</p>
                </FaqItem>
                <FaqItem question="How do I keep the document consistent as the idea changes?">
                    <p>This is a major challenge with manual documents. If you change a feature in one section, you have to remember to update it everywhere else. Using a dedicated tool with features like "Regenerate" helps ensure that your entire specification stays consistent as your vision evolves.</p>
                </FaqItem>
            </div>
        </section>

        <Section>
            <div className="text-center">
                <p>I hope this guide gives you the confidence to get your next great idea down on paper!</p>
                <p className="mt-4 font-semibold">Have you ever had a project go wrong because of a bad spec? Drop your story in the comments below!</p>
            </div>
        </Section>
      </main>
    </div>
  );
};
