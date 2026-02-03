import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Fallback for some project structures
  ],
  theme: {
    extend: {
      colors: {
        // --- 1. Main Brand Identity (Public Site) ---
        primary: {
          DEFAULT: '#003366', // Deep Sea Blue (Main Text/Buttons)
          100: '#e6f0ff',
          200: '#99c2ff',
        },
        accent: {
          DEFAULT: '#00e5ff', // Clinical Cyan (Highlights)
          hover: '#00b8cc',
        },
        surface: {
          light: '#f8fafc', // Very light grey/blue for backgrounds
          dark: '#0f172a',  // Deep slate for dark sections
        },
        
        // --- 2. Sovereign Dashboard Palette (New) ---
        // These match your Stitch designs perfectly
        dashboard: {
          dark: '#101822',   // The Command Center background
          light: '#f6f7f8',  // The Light Mode background
          card: '#1a3333',   // The "Ritual Archive" card color
          border: '#234848', // The subtle green-teal borders
        },
        sovereign: {
          teal: '#13ecec',   // The glowing "Active" state
          slate: '#1a3333',  // Dark surface for cards
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-merriweather)', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
};

export default config;