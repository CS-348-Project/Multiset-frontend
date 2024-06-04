/** @type {import('tailwindcss').Config} */
export default {
  content: [
    ,
    "./node_modules/preline/preline.js",
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("preline/plugin")],
};
