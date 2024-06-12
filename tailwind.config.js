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
        border: "hsl(var(--creme))",
        input: "hsl(var(--creme))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--dusk))",
        foreground: "hsl(var(--creme))",
        primary: {
          DEFAULT: "hsl(var(--creme))",
          foreground: "hsl(var(--dusk))",
        },
        secondary: {
          DEFAULT: "hsl(var(--rose))",
          foreground: "hsl(var(--dusk))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--darkrose))",
          foreground: "hsl(var(--creme))",
        },
        muted: {
          DEFAULT: "hsl(var(--offdusk))",
          foreground: "hsl(var(--creme))",
        },
        accent: {
          DEFAULT: "hsl(var(--lilac))",
          foreground: "hsl(var(--dusk))",
        },
        popover: {
          DEFAULT: "hsl(var(--offdusk))",
          foreground: "hsl(var(--creme))",
        },
        card: {
          DEFAULT: "hsl(var(--creme))",
          foreground: "hsl(var(--dusk))",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
