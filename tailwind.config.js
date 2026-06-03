/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maritime: {
          950: '#060d16',
          900: '#0c1929',
          800: '#152b41',
          700: '#1e3c5a',
        },
        cyan: '#00f2ff',
        green: '#00ff9d',
        purple: '#bc00ff',
      },
    },
  },
  plugins: [],
}
