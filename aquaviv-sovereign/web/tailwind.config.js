/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#003366", // Deep Sea Blue
        accent: "#00E5FF",  // Bio-Available Cyan
        background: {
          light: "#ffffff",
          dark: "#0f1923",
        },
        surface: {
          light: "#f8fafc",
          dark: "#162e2e",
        }
      },
      fontFamily: {
        sans: ["sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};