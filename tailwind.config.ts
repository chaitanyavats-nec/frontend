import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontSize: {
      xs: ["11px", { lineHeight: "16px" }],
      sm: ["13px", { lineHeight: "20px" }],
      base: ["15px", { lineHeight: "24px" }],
      lg: ["18px", { lineHeight: "28px" }],
      xl: ["22px", { lineHeight: "30px" }],
      "2xl": ["28px", { lineHeight: "36px" }],
      "3xl": ["36px", { lineHeight: "44px" }],
      "5xl": ["56px", { lineHeight: "64px" }],
    },
    extend: {
      colors: {
        white: {
          0: "rgb(var(--white-0) / <alpha-value>)",
          50: "rgb(var(--white-50) / <alpha-value>)",
          100: "rgb(var(--white-100) / <alpha-value>)",
          200: "rgb(var(--white-200) / <alpha-value>)",
          300: "rgb(var(--white-300) / <alpha-value>)",
          400: "rgb(var(--white-400) / <alpha-value>)",
          500: "rgb(var(--white-500) / <alpha-value>)",
          600: "rgb(var(--white-600) / <alpha-value>)",
          700: "rgb(var(--white-700) / <alpha-value>)",
          800: "rgb(var(--white-800) / <alpha-value>)",
          900: "rgb(var(--white-900) / <alpha-value>)",
          1000: "rgb(var(--white-1000) / <alpha-value>)",
        },
        ink: {
          500: "rgb(var(--ink-500) / <alpha-value>)",
          900: "rgb(var(--ink-900) / <alpha-value>)",
          DEFAULT: "rgb(var(--color-ink) / <alpha-value>)",
        },
        paper: {
          50: "rgb(var(--paper-50) / <alpha-value>)",
          100: "rgb(var(--paper-100) / <alpha-value>)",
          200: "rgb(var(--paper-200) / <alpha-value>)",
          300: "rgb(var(--paper-300) / <alpha-value>)",
          400: "rgb(var(--paper-400) / <alpha-value>)",
          500: "rgb(var(--paper-500) / <alpha-value>)",
          600: "rgb(var(--paper-600) / <alpha-value>)",
          700: "rgb(var(--paper-700) / <alpha-value>)",
          800: "rgb(var(--paper-800) / <alpha-value>)",
          900: "rgb(var(--paper-900) / <alpha-value>)",
          1000: "rgb(var(--paper-1000) / <alpha-value>)",
          DEFAULT: "rgb(var(--color-paper) / <alpha-value>)",
          dark: "rgb(var(--color-paper-dark) / <alpha-value>)",
        },
        surface: {
          DEFAULT: "rgb(var(--color-surface) / <alpha-value>)",
        },
        teal: {
          100: "rgb(var(--teal-100) / <alpha-value>)",
          500: "rgb(var(--teal-500) / <alpha-value>)",
          700: "rgb(var(--teal-700) / <alpha-value>)",
          DEFAULT: "rgb(var(--color-teal) / <alpha-value>)",
          dark: "rgb(var(--color-teal-dark) / <alpha-value>)",
          light: "rgb(var(--color-teal-light) / <alpha-value>)",
        },
        orange: {
          100: "rgb(var(--orange-100) / <alpha-value>)",
          500: "rgb(var(--orange-500) / <alpha-value>)",
          DEFAULT: "rgb(var(--color-orange) / <alpha-value>)",
          light: "rgb(var(--color-orange-light) / <alpha-value>)",
        },
        violet: {
          100: "rgb(var(--violet-100) / <alpha-value>)",
          500: "rgb(var(--violet-500) / <alpha-value>)",
          DEFAULT: "rgb(var(--color-violet) / <alpha-value>)",
          light: "rgb(var(--color-violet-light) / <alpha-value>)",
        },
        slate: {
          DEFAULT: "rgb(var(--color-slate) / <alpha-value>)",
          light: "rgb(var(--color-slate-light) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "serif"],
        editorial: ["var(--font-fraunces)", "serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
      borderWidth: {
        "0.5": "0.5px",
      },
      transitionDuration: {
        "150": "150ms",
        "200": "200ms",
        "300": "300ms",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
