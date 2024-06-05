/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Josefin Sans", "sans-serif"],
      secondary: ["Open Sans", "sans-serif"],
    },
    extend: {
      colors: {
        coral: "#F77870",
        rose: "#F79C94",
        creme: "#F7F1E3",
        dusk: "#32312E",
        primary: "#F77870",
        secondary: "#F79C94",
        light: "#F7F1E3",
        dark: "#32312E",
        accent: "#F77870",
      },
    },
  },
  plugins: [],
};
