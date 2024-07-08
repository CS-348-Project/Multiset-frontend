/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        coral: "hsl(var(--coral))",
        rose: "hsl(var(--rose))",
        darkrose: "hsl(var(--darkrose))",
        creme: "hsl(var(--creme))",
        dusk: "hsl(var(--dusk))",
        offdusk: "hsl(var(--offdusk))",
        lilac: "hsl(var(--lilac))",
        navy: "hsl(var(--navy))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "yellow-blob": {
          "0%": { top: "40vh", right: "20vw", transform: "scale(1)" },
          "30%": { top: "50vh", right: "30vw", transform: "scale(1.2)" },
          "60%": { top: "20vh", right: "20vw", transform: "scale(1.3)" },
          "100%": { top: "40vh", right: "15vw", transform: "scale(1)" },
        },
        "green-blob": {
          "0%": { top: "30vh", right: "16vw", transform: "scale(1.2)" },
          "30%": { top: "60vh", right: "16vw", transform: "scale(1)" },
          "60%": { top: "40vh", right: "26vw", transform: "scale(1)" },
          "100%": { top: "32vh", right: "16vw", transform: "scale(1.2)" },
        },
        "red-blob": {
          "0%": { top: "40vh", right: "14vw", transform: "scale(1)" },
          "30%": { top: "25vh", right: "20vw", transform: "scale(1.4)" },
          "60%": { top: "40vh", right: "16vw", transform: "scale(1)" },
          "100%": { top: "40vh", right: "14vw", transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "yellow-blob": "yellow-blob 8s ease-in-out infinite",
        "green-blob": "green-blob 8s ease-in-out infinite",
        "red-blob": "red-blob 8s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
