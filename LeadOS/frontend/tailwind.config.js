/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Add dark mode strategy class
  theme: {
    extend: {
      colors: {
        success: '#10b981', // Tailwind emerald-500
        warning: '#f59e0b', // Tailwind amber-500
        danger: '#ef4444',  // Tailwind red-500
      },
      spacing: {
        sidebar: '240px',
        topbar: '56px',
      }
    },
  },
  plugins: [],
}
