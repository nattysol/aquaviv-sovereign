import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- 1. Main Brand Identity ---
        primary: {
          DEFAULT: '#003366', // Deep Sea Blue (Unchanged)
          100: '#e6f0ff',
          200: '#99c2ff',
        },
        accent: {
          DEFAULT: '#00b4d8', // <--- UPDATED: Softer "Clinical Cerulean"
          hover: '#0096c7',   // Darker shade for hover states
        },
        surface: {
          light: '#f8fafc', 
          dark: '#0f172a',  
        },
        
        // --- 2. Sovereign Dashboard Palette ---
        dashboard: {
          dark: '#101822',   
          light: '#f6f7f8',  
          card: '#1a3333',   
          border: '#234848', 
        },
        sovereign: {
          teal: '#2dd4bf',   // <--- UPDATED: A softer teal for dashboard accents
          slate: '#1a3333',  
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
  plugins: [
    require('@tailwindcss/typography'), // <--- ADD THIS LINE
  ],
};

export default config;