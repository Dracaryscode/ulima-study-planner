/** @type {import('tailwindcss').Config} */
export default {
  // Ensure Tailwind scans project files for used classes
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './public/**/*.html'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
