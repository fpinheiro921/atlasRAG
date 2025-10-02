### 11. Styling Guidelines

#### 11.1 Design System & Brand Personality

1.1.1 **Design Philosophy:** The aesthetic of Atlas is built on these core principles:
* **Data-First Clarity:** The UI prioritizes clear, scannable data visualization. Charts, numbers, and key metrics are the heroes of the design.
* **Glassmorphism & Depth:** We use a "glassmorphism" effect for core components like cards. This involves blurred backgrounds, semi-transparent fills, and subtle borders to create a sense of depth and focus.
* **Motivational Modernism:** The aesthetic is clean, sharp, and tech-forward, but the color palette and typography are chosen to be encouraging and empowering, not sterile or intimidating.
* **Dark Mode Native:** The design was conceived with a dark theme first, ensuring a comfortable experience in low-light conditions. The light theme is a bright, clean alternative.
1.1.2 **Color Palette:**
* **Primary Colors:**
* `brand`: `hsl(221.2 83.2% 53.3%)`
* `accent`: `hsl(166.7 85.7% 35.7%)`
* **Neutral Palette (Slate):**
* Dark Mode Background: `slate.950` (`#020617`)
* Dark Mode Card Surface: `slate.900` (`#0f172a`)
* Light Mode Background: `slate.100` (`#f1f5f9`)
* Light Mode Card Surface: `white`
* Dark Mode Text: `slate.200` (primary), `slate.400` (secondary)
* Light Mode Text: `slate.800` (primary), `slate.600` (secondary)
* **Feedback Colors:**
* Success: `text-green-500`
* Warning: `text-yellow-500`
* Error: `text-red-500`
* Info: `text-sky-500`
1.1.3 **Typography:**
* **Display Font (`font-display`):** `Anybody`. Used for `<h1>`, `<h2>`, and feature titles. Typically uppercase and bold.
* **Body Font (`font-sans`):** `Roboto Flex`. Used for all other text to ensure readability.
1.1.4 **Iconography:**
* **Library:** Google Material Symbols.
* **Style:** `Outlined` style exclusively for a modern, light feel.

#### 11.2 Theme Logic & Adaptability

2.1 **Dark Mode First:** The primary theme is dark mode. All components must be designed with dark mode as the default consideration. The light theme is a bright, clean alternative.
2.2 **Color Contrast:** All text/background combinations must pass WCAG 2.2 AA (4.5:1 contrast ratio) in both light and dark modes.

#### 11.3 Layout & Responsiveness

3.1 **System:** Based on Tailwind CSS's default `rem`-based spacing scale for consistency and scalability.
3.2 **Layout Strategy:** A fixed `w-20` vertical sidebar for primary navigation, with the main content area occupying the remaining space.
3.3 **Responsiveness:** A mobile-first approach using Tailwind's breakpoints (`sm:`, `md:`, `lg:`). Grid layouts are heavily used to adapt content to different screen sizes.

#### 11.4 Component Library

4.1 **Atoms:**
* **Buttons:** `rounded-lg`. Primary variant uses the solid `brand` color. Secondary variant uses a subtle gray. Buttons must include a loading state that shows a spinner and disables the button.
* **Inputs/Forms:** Clean and minimal with `bg-slate-50` / `dark:bg-slate-700` background. A clear blue (`focus:ring-brand`) focus state is mandatory.
4.2 **Molecules:**
* **Cards:** The core component of the UI. They use a glassmorphism effect.
* **Background:** `bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl`
* **Border:** `border border-white/20 dark:border-slate-700/60`
* **Rounding:** `rounded-card` (`1rem`)
* **Shadow:** `shadow-2xl shadow-black/20 dark:shadow-black/40`
4.3 **Micro-interactions:**
* All interactive elements have smooth transitions (`transition-colors duration-200`).
* Page transitions and modals fade in gently (`animate-fade-in`).

#### 11.5 Accessibility & UX Safeguards

5.1 **WCAG Standard:** Target WCAG 2.2 Level AA compliance.
5.2 **Semantic HTML:** Use appropriate tags (`<nav>`, `<main>`, `<button>`) to ensure a proper document outline.
5.3 **Focus Management:** All interactive elements must have a clear, visible focus state.
5.4 **Icons & Images:** All icons must be accompanied by a text label or have a `title` attribute. All content images must have descriptive `alt` text.

#### 11.6 Error / Empty / Loading States

6.1 **Loading:** Use on-brand loaders (`PlanGenerationLoader.tsx`) for asynchronous operations. Button spinners provide feedback for specific actions.
6.2 **Error/Feedback:** Use the defined feedback colors to communicate status. Error messages should be concise and actionable.
6.3 **Empty States:** Design empty states to be motivational, with a clear call-to-action to guide the user's next step.

#### 11.7 Quality Gates & Tooling

7.1 **Linting:** `stylelint` to enforce CSS best practices.
7.2 **Visual Regression Testing:** Use Chromatic with Storybook to automatically detect visual changes in components on every pull request.
7.3 **Browser Matrix:** Test on the latest versions of Chrome, Firefox, and Safari (desktop and iOS).

#### 11.8 Sample Code Snippet

```tsx
/* tailwind.config.js extract */
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto Flex', ...fontFamily.sans],
        display: ['Anybody', ...fontFamily.sans],
      },
      borderRadius: {
        card: '1rem',
      },
      colors: {
        brand: {
          DEFAULT: 'hsl(221.2 83.2% 53.3%)',
          light: 'hsl(217.2 91.2% 59.8%)',
        },
        accent: {
          DEFAULT: 'hsl(166.7 85.7% 35.7%)',
          light: 'hsl(162.1 79.9% 47.1%)',
        }
      },
    },
  },
};

/* React Card Component Example: /components/ui/Card.tsx */
import * as React from 'react';
import { cn } from '@/lib/utils'; // A utility for combining class names

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-card border shadow-2xl',
        'bg-white/60 dark:bg-slate-900/60',
        'backdrop-blur-2xl',
        'border-white/20 dark:border-slate-700/60',
        'shadow-black/20 dark:shadow-black/40',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

export { Card };
```

#### 11.9 Cross-References

  * **Tech Stack Spec (§2):** Lists TailwindCSS and Radix versions.
  * **Project Structure (§3):** Defines where UI components (`/web/components/ui`) and styles live.
  * **User Flow (§5):** References the visual implementation of error and loading states.