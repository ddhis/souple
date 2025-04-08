/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './styles/**/*.{css}' // ✅ 이것이 꼭 필요함!
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
