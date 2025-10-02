/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        myanmar: ['Padauk', 'Myanmar Text', 'sans-serif'],
        comic: ['"Lilita One"', 'sans-serif'],
      },
      colors: {
        'pop-blue': '#0EA5E9',      // sky-500
        'pop-lime': '#A3E635',      // lime-400
        'pop-pink': '#F472B6',      // pink-400
        'pop-cyan': '#22D3EE',      // cyan-400
        'pop-bg-light': '#E0F2FE',  // sky-100
        'pop-bg-dark': '#0F172A',   // slate-900
      },
      boxShadow: {
        'comic': '4px 4px 0px #000',
        'comic-hover': '6px 6px 0px #000',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'background-pan': 'backgroundPan 15s ease infinite'
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        backgroundPan: {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' }
        }
      }
    },
  },
  plugins: [],
}
