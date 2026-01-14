/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Literata', 'Georgia', 'serif'],
        sans: ['Work Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Warm wood and cozy tones
        wood: {
          light: '#D4A574',
          DEFAULT: '#8B6F47',
          dark: '#5C4A2F',
          darker: '#3E3023',
        },
        cream: {
          light: '#FBF8F3',
          DEFAULT: '#F5EFE7',
          dark: '#E8DFD0',
        },
        amber: {
          glow: '#FFA726',
          warm: '#FF9800',
        },
      },
      boxShadow: {
        'book': '4px 4px 12px rgba(0, 0, 0, 0.15), 2px 2px 6px rgba(0, 0, 0, 0.1)',
        'book-hover': '6px 6px 20px rgba(0, 0, 0, 0.2), 3px 3px 10px rgba(0, 0, 0, 0.15)',
        'shelf': 'inset 0 -2px 8px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}
