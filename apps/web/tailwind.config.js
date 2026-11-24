/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F5F5F5',
        card: '#FFFFFF',
        ink: '#000000',
        muted: '#666666',
        'border-light': '#E5E5E5',
        'video-dark': '#1A1A1A',
        'yellow-sticky': '#FEEA3D',
        aqua: {
          light: '#FAFCFF',
          blue: '#6FB3F6',
          border: '#221898',
          accent: '#0F7FFF',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"Geist Mono"', '"SF Mono"', 'Consolas', 'monospace'],
        serif: ['"Instrument Serif"', 'serif'],
      },
      boxShadow: {
        'os-window': '0 10px 24px rgba(0,0,0,0.12)',
        'aqua-glass': 'inset 0 1px 1px rgba(255,255,255,0.9), inset 0 -2px 4px rgba(15,60,140,0.22), 0 4px 12px rgba(34,24,152,0.14)',
        'sticky-note': '2px 4px 12px rgba(0,0,0,0.08)',
      }
    },
  },
  plugins: [],
}
