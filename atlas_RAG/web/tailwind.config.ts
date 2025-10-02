import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'hsl(221.2 83.2% 53.3%)', // #3B82F6
          light: 'hsl(217.2 91.2% 59.8%)',
          dark: 'hsl(221.2 83.2% 43.3%)',
        },
        accent: {
          DEFAULT: 'hsl(166.7 85.7% 35.7%)', // #0D9488 - Teal
          light: 'hsl(162.1 79.9% 47.1%)',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        display: ['Anybody', 'sans-serif'],
        sans: ['Roboto Flex', 'sans-serif'],
      },
      borderRadius: {
        card: '1rem',
      },
    },
  },
  plugins: [],
};

export default config;
