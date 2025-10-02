# Atlas Design System

This document defines the visual design language for the Atlas fitness & nutrition tracking application. The design philosophy emphasizes **data clarity**, **glassmorphism**, and a **motivational modern aesthetic**.

## Design Philosophy

### Core Principles

1. **Data-First Clarity**
   - Numbers, charts, and metrics are the heroes
   - Clear visual hierarchy for scannable information
   - Large, readable typography for key stats

2. **Glassmorphism & Depth**
   - Semi-transparent cards with blur effects
   - Layered UI with subtle shadows
   - Depth creates focus and visual interest

3. **Motivational Modernism**
   - Clean, tech-forward aesthetic
   - Encouraging color palette
   - Empowering, not sterile

4. **Dark Mode Native**
   - Designed dark-first for comfortable viewing
   - Light mode as a bright alternative
   - Seamless theme switching

---

## Color Palette

### Primary Colors

```css
/* Brand Blue - Primary actions, links, highlights */
--brand: hsl(221.2 83.2% 53.3%)        /* #3B82F6 */
--brand-light: hsl(217.2 91.2% 59.8%)  /* Hover state */
--brand-dark: hsl(221.2 83.2% 43.3%)   /* Active state */

/* Accent Teal - Secondary highlights, positive indicators */
--accent: hsl(166.7 85.7% 35.7%)       /* #0D9488 */
--accent-light: hsl(162.1 79.9% 47.1%) /* Hover state */
```

### Neutral Palette (Slate)

```css
/* Dark Mode */
--slate-950: #020617  /* Background */
--slate-900: #0f172a  /* Card surface */
--slate-800: #1e293b  /* Elevated surface */
--slate-700: #334155  /* Borders */
--slate-600: #475569  /* Subtle borders */
--slate-500: #64748b  /* Disabled text */
--slate-400: #94a3b8  /* Secondary text */
--slate-300: #cbd5e1  /* Hover borders */
--slate-200: #e2e8f0  /* Primary text */
--slate-100: #f1f5f9  /* Light mode background */
--slate-50:  #f8fafc  /* Light mode surface */
```

### Feedback Colors

```css
/* Success / Positive / Gains */
--success: #10b981    /* Green-500 */

/* Warning / Hold / Maintenance */
--warning: #f59e0b    /* Yellow-500 */

/* Error / Decrease / Deficit */
--error: #ef4444      /* Red-500 */

/* Info / Suggestions */
--info: #0ea5e9       /* Sky-500 */
```

---

## Typography

### Font Families

```css
/* Display Font - Headings & Impactful Text */
font-family: 'Anybody', sans-serif;
/* Usage: <h1>, <h2>, feature titles */
/* Always: UPPERCASE, font-bold or font-extrabold */

/* Body Font - All Other Text */
font-family: 'Roboto Flex', sans-serif;
/* Usage: paragraphs, labels, UI text */
/* Versatile, readable at all sizes */
```

### Type Scale

```css
/* Headings */
h1: text-4xl md:text-5xl font-display font-extrabold uppercase
h2: text-3xl md:text-4xl font-display font-bold uppercase
h3: text-2xl font-sans font-bold
h4: text-xl font-sans font-semibold

/* Body */
body: text-base font-sans
small: text-sm font-sans
label: text-sm font-sans font-medium
caption: text-xs font-sans text-slate-500

/* Data Display */
metric-large: text-5xl md:text-6xl font-bold tabular-nums
metric-medium: text-3xl md:text-4xl font-bold tabular-nums
metric-small: text-xl font-semibold tabular-nums
```

### Text Colors

```css
/* Dark Mode */
--text-primary: text-slate-200
--text-secondary: text-slate-400
--text-tertiary: text-slate-500

/* Light Mode */
--text-primary: text-slate-800
--text-secondary: text-slate-600
--text-tertiary: text-slate-500
```

---

## Components

### Cards

**The fundamental UI building block**

```tsx
<Card className="
  bg-white/60 dark:bg-slate-900/60
  backdrop-blur-2xl
  border border-white/20 dark:border-slate-700/60
  rounded-2xl
  shadow-2xl shadow-black/20 dark:shadow-black/40
  p-6 sm:p-8
">
```

**Variations:**

- **Elevated Card**: Add `translate-y-[-4px] hover:translate-y-[-6px] transition-transform`
- **Interactive Card**: Add hover state with `hover:border-brand/40`
- **Stat Card**: Minimal padding with `p-4` for compact data display

### Buttons

**Primary Button**
```tsx
<Button className="
  bg-brand hover:bg-brand-light
  text-white font-semibold
  rounded-lg px-6 py-3
  transition-colors duration-200
  shadow-lg shadow-brand/30
  focus:ring-2 focus:ring-brand focus:ring-offset-2
">
```

**Secondary Button**
```tsx
<Button className="
  bg-slate-200 dark:bg-slate-700
  text-slate-800 dark:text-slate-200
  hover:bg-slate-300 dark:hover:bg-slate-600
  rounded-lg px-6 py-3
  transition-colors duration-200
">
```

**Ghost Button**
```tsx
<Button className="
  bg-transparent
  text-brand hover:text-brand-light
  border border-slate-300 dark:border-slate-600
  hover:border-brand/50
  rounded-lg px-6 py-3
  transition-all duration-200
">
```

### Form Elements

**Input**
```tsx
<Input className="
  bg-slate-50 dark:bg-slate-700
  border border-slate-300 dark:border-slate-600
  text-slate-800 dark:text-slate-200
  placeholder:text-slate-500
  rounded-lg px-4 py-2.5
  focus:ring-2 focus:ring-brand focus:border-brand
  transition-all duration-200
">
```

**Select**
```tsx
<Select className="
  bg-slate-50 dark:bg-slate-700
  border border-slate-300 dark:border-slate-600
  text-slate-800 dark:text-slate-200
  rounded-lg px-4 py-2.5
  focus:ring-2 focus:ring-brand
  cursor-pointer
">
```

**Slider**
```tsx
<input type="range" className="
  w-full h-2
  bg-slate-200 dark:bg-slate-700
  rounded-lg appearance-none
  accent-brand
  cursor-pointer
">
```

### Navigation

**Vertical Sidebar** (Fixed, persistent navigation)
```tsx
<nav className="
  fixed left-0 top-0 h-screen
  w-20
  bg-slate-900/95 dark:bg-slate-950/95
  backdrop-blur-xl
  border-r border-slate-700/60
  flex flex-col items-center
  py-4 gap-2
">
```

**Nav Item**
```tsx
<button className="
  w-14 h-14
  flex items-center justify-center
  rounded-xl
  text-slate-400 hover:text-brand
  hover:bg-slate-800/60
  transition-colors duration-200
  group
">
```

### Data Display

**Metric Card**
```tsx
<Card className="p-6">
  <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">
    Daily Calories
  </div>
  <div className="text-4xl font-bold text-slate-200 tabular-nums">
    2,250
  </div>
  <div className="text-sm text-green-500 mt-2">
    ↑ On target
  </div>
</Card>
```

**Progress Bar**
```tsx
<div className="relative h-3 bg-slate-700/40 rounded-full overflow-hidden">
  <div className="
    absolute inset-y-0 left-0
    bg-gradient-to-r from-brand to-accent
    rounded-full
    transition-all duration-500
  " style={{ width: '75%' }} />
</div>
```

---

## Iconography

**Library**: Google Material Symbols (Outlined)

**Usage**:
```tsx
<span className="material-symbols-outlined text-2xl text-brand">
  fitness_center
</span>
```

**Common Icons**:
- `dashboard` - Dashboard/Home
- `restaurant` - Food/Nutrition
- `fitness_center` - Workout/Exercise
- `trending_up` - Progress/Goals
- `psychology` - AI Coach/Chat
- `settings` - Settings
- `person` - Profile
- `calendar_today` - Check-ins
- `show_chart` - Analytics

---

## Layout & Spacing

### Grid System

```tsx
/* Dashboard Grid */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

/* Stat Row */
<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

/* Two Column Layout */
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
```

### Spacing Scale

```css
gap-2:  0.5rem  /* Tight elements */
gap-4:  1rem    /* Related items */
gap-6:  1.5rem  /* Card spacing */
gap-8:  2rem    /* Section spacing */
gap-12: 3rem    /* Major sections */

p-4:    1rem    /* Compact padding */
p-6:    1.5rem  /* Standard padding */
p-8:    2rem    /* Generous padding */
```

### Main Layout Structure

```tsx
<div className="flex h-screen bg-slate-950">
  {/* Sidebar - Fixed */}
  <nav className="w-20 fixed left-0 top-0 h-screen">
    {/* Navigation items */}
  </nav>

  {/* Main Content */}
  <main className="flex-1 ml-20 overflow-y-auto">
    <div className="container mx-auto max-w-7xl p-6 sm:p-8">
      {/* Page content */}
    </div>
  </main>
</div>
```

---

## Animation & Transitions

### Standard Transitions

```css
/* Color changes */
transition-colors duration-200

/* Transform */
transition-transform duration-300 ease-out

/* All properties */
transition-all duration-200
```

### Entrance Animations

```tsx
/* Fade in */
<div className="animate-fade-in">

/* Slide up */
<div className="animate-slide-up">

/* Scale in */
<div className="animate-scale-in">
```

### Loading States

**Button Spinner**
```tsx
<button disabled className="relative">
  <span className="opacity-0">Save</span>
  <Spinner className="absolute inset-0 m-auto" />
</button>
```

**Full Page Loader**
```tsx
<div className="fixed inset-0 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center">
  <div className="text-center">
    <Spinner size="lg" />
    <p className="mt-4 text-slate-400">Calculating your plan...</p>
  </div>
</div>
```

**Skeleton Loading**
```tsx
<div className="animate-pulse space-y-4">
  <div className="h-4 bg-slate-700/40 rounded w-3/4" />
  <div className="h-4 bg-slate-700/40 rounded w-1/2" />
</div>
```

---

## Theme Implementation

### Tailwind Config

```javascript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      brand: {
        DEFAULT: 'hsl(221.2 83.2% 53.3%)',
        light: 'hsl(217.2 91.2% 59.8%)',
      },
      accent: {
        DEFAULT: 'hsl(166.7 85.7% 35.7%)',
        light: 'hsl(162.1 79.9% 47.1%)',
      },
    },
    fontFamily: {
      display: ['Anybody', 'sans-serif'],
      sans: ['Roboto Flex', 'sans-serif'],
    },
    borderRadius: {
      card: '1rem',
    },
    animation: {
      'fade-in': 'fadeIn 0.3s ease-out',
      'slide-up': 'slideUp 0.4s ease-out',
      'scale-in': 'scaleIn 0.3s ease-out',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
      slideUp: {
        '0%': { transform: 'translateY(20px)', opacity: '0' },
        '100%': { transform: 'translateY(0)', opacity: '1' },
      },
      scaleIn: {
        '0%': { transform: 'scale(0.95)', opacity: '0' },
        '100%': { transform: 'scale(1)', opacity: '1' },
      },
    },
  },
}
```

### Global Styles

```css
/* globals.css */
@import url('https://fonts.googleapis.com/css2?family=Anybody:wght@700;900&family=Roboto+Flex:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@300;400;600');

@layer base {
  body {
    @apply font-sans antialiased;
  }

  h1, h2 {
    @apply font-display uppercase;
  }

  /* Tabular numbers for metrics */
  .metric {
    @apply tabular-nums;
  }
}
```

---

## Accessibility

### Focus States

All interactive elements must have clear focus indicators:

```tsx
focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-slate-950
```

### Color Contrast

- **Dark Mode**: Minimum 7:1 contrast ratio for text
- **Light Mode**: Minimum 7:1 contrast ratio for text
- All colors meet WCAG AAA standards

### Screen Reader Support

```tsx
/* Icon buttons */
<button aria-label="Open menu">
  <span className="material-symbols-outlined">menu</span>
</button>

/* Loading states */
<div role="status" aria-live="polite">
  <Spinner />
  <span className="sr-only">Loading...</span>
</div>
```

---

## Component Examples

### Dashboard Stat Card

```tsx
<Card className="p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl">
  <div className="flex items-center justify-between mb-4">
    <span className="material-symbols-outlined text-brand text-3xl">
      local_fire_department
    </span>
    <span className="text-xs text-green-500 font-semibold">
      ↑ 12%
    </span>
  </div>

  <div className="space-y-2">
    <p className="text-xs text-slate-500 uppercase tracking-wider">
      Calories Burned
    </p>
    <p className="text-4xl font-bold text-slate-200 tabular-nums">
      2,450
    </p>
    <p className="text-sm text-slate-400">
      450 above target
    </p>
  </div>
</Card>
```

### Macro Progress Card

```tsx
<Card className="p-6">
  <div className="space-y-6">
    {/* Protein */}
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">Protein</span>
        <span className="text-sm tabular-nums">165g / 170g</span>
      </div>
      <div className="h-3 bg-slate-700/40 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-brand to-accent rounded-full"
             style={{ width: '97%' }} />
      </div>
    </div>

    {/* Carbs */}
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">Carbs</span>
        <span className="text-sm tabular-nums">180g / 220g</span>
      </div>
      <div className="h-3 bg-slate-700/40 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
             style={{ width: '82%' }} />
      </div>
    </div>

    {/* Fats */}
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">Fats</span>
        <span className="text-sm tabular-nums">55g / 66g</span>
      </div>
      <div className="h-3 bg-slate-700/40 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
             style={{ width: '83%' }} />
      </div>
    </div>
  </div>
</Card>
```

---

## Best Practices

1. **Always use glassmorphism for cards** - Creates depth and focus
2. **Maintain consistent spacing** - Use the 4/6/8 scale
3. **Use tabular numbers for metrics** - Ensures alignment
4. **Provide loading states** - Never leave users wondering
5. **Dark mode first** - Design in dark, adapt to light
6. **Test contrast** - Ensure readability in both themes
7. **Animate transitions** - Smooth, not jarring (200-300ms)
8. **Use brand color sparingly** - For emphasis and actions
9. **Uppercase display font** - Only for major headings
10. **Progressive disclosure** - Show important data first

---

**Questions?** Refer to existing components in `/components/ui` for implementation examples.
