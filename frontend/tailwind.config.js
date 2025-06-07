/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Light mode pastel palette
        'pastel': {
          'cream': '#fdf8f6',        // Main background
          'lavender': '#f0f4ff',     // Secondary background
          'peach': '#fff3f0',        // Tertiary background
          'plum': '#2d1b4e',         // Primary text
          'purple': '#5a4a7a',       // Secondary text
          'muted': '#8b7fa8',        // Muted text
          'rose': '#ff8fab',         // Primary accent
          'mint': '#a8dadc',         // Secondary accent
          'sunny': '#ffd23f',        // Tertiary accent
          'coral': '#ff9aa2',        // Coral blush
          'soft-peach': '#ffb3ba',   // Soft peach
          'sage': '#c7cedb',         // Sage blue
          'lilac': '#e2a5f2',        // Lilac dream
          'border': '#e8d5db',       // Soft border
        }
      },
    },
  },
  plugins: [],
  darkMode: 'class', // Enable class-based dark mode
}