/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#090d16',
          card: '#0f172a',
          border: '#1e293b',
          accent: '#06b6d4',
          glow: '#3b82f6',
        }
      }
    },
  },
  plugins: [],
}
