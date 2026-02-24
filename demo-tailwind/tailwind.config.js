/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        'fade-in':    { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-down': { from: { opacity: '0', transform: 'translateY(-8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        'fade-in':    'fade-in 120ms ease-out',
        'slide-down': 'slide-down 150ms ease-out',
      },
    },
  },
  plugins: [],
}
