/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#020817',
        mist: '#e8eef7',
        muted: '#94a3b8',
        accent: '#38bdf8',
        glow: '#0ea5e9',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        display: ['Unbounded', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(56, 189, 248, 0.35)',
        card: '0 0 0 1px rgba(148, 163, 184, 0.18)',
      },
    },
  },
  plugins: [],
}
