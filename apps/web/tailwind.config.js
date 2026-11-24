/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        clicky: {
          blue: '#3b82f6',
          dark: '#0a0f1d',
          surface: '#121829',
          border: '#1e293b',
          accent: '#60a5fa',
          yellow: '#fef08a',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"SF Mono"', 'Monaco', 'Inconsolata', '"Fira Code"', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
