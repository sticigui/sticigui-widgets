/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,mjs,ts,jsx,tsx}",
    "./widgets/**/*.{js,mjs,ts,jsx,tsx}",
  ],
  prefix: 'sg-',
  important: '.sg-widget-root',
  corePlugins: {
    preflight: false,
  },
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
