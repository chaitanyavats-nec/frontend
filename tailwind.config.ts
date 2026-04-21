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
        neutral: {
          50: "var(--n-50)",
          100: "var(--n-100)",
          200: "var(--n-200)",
          300: "var(--n-300)",
          400: "var(--n-400)",
          500: "var(--n-500)",
          600: "var(--n-600)",
          700: "var(--n-700)",
          800: "var(--n-800)",
          900: "var(--n-900)",
        },
        cyan: {
          50: "rgb(var(--cy-50) / <alpha-value>)",
          100: "rgb(var(--cy-100) / <alpha-value>)",
          200: "rgb(var(--cy-200) / <alpha-value>)",
          300: "rgb(var(--cy-300) / <alpha-value>)",
          400: "rgb(var(--cy-400) / <alpha-value>)",
          500: "rgb(var(--cy-500) / <alpha-value>)",
          600: "rgb(var(--cy-600) / <alpha-value>)",
          700: "rgb(var(--cy-700) / <alpha-value>)",
          800: "rgb(var(--cy-800) / <alpha-value>)",
          900: "rgb(var(--cy-900) / <alpha-value>)",
        },
        magenta: {
          50: "rgb(var(--mg-50) / <alpha-value>)",
          100: "rgb(var(--mg-100) / <alpha-value>)",
          200: "rgb(var(--mg-200) / <alpha-value>)",
          300: "rgb(var(--mg-300) / <alpha-value>)",
          400: "rgb(var(--mg-400) / <alpha-value>)",
          500: "rgb(var(--mg-500) / <alpha-value>)",
          600: "rgb(var(--mg-600) / <alpha-value>)",
          700: "rgb(var(--mg-700) / <alpha-value>)",
          800: "rgb(var(--mg-800) / <alpha-value>)",
          900: "rgb(var(--mg-900) / <alpha-value>)",
        },
        yellow: {
          50: "rgb(var(--yl-50) / <alpha-value>)",
          100: "rgb(var(--yl-100) / <alpha-value>)",
          200: "rgb(var(--yl-200) / <alpha-value>)",
          300: "rgb(var(--yl-300) / <alpha-value>)",
          400: "rgb(var(--yl-400) / <alpha-value>)",
          500: "rgb(var(--yl-500) / <alpha-value>)",
          600: "rgb(var(--yl-600) / <alpha-value>)",
          700: "rgb(var(--yl-700) / <alpha-value>)",
          800: "rgb(var(--yl-800) / <alpha-value>)",
          900: "rgb(var(--yl-900) / <alpha-value>)",
        },
        success: {
          DEFAULT: "rgb(var(--su-500) / <alpha-value>)",
          light: "rgb(var(--su-50) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "rgb(var(--wa-500) / <alpha-value>)",
          light: "rgb(var(--wa-50) / <alpha-value>)",
        },
        danger: {
          DEFAULT: "rgb(var(--da-500) / <alpha-value>)",
          light: "rgb(var(--da-50) / <alpha-value>)",
        },
        info: {
          DEFAULT: "rgb(var(--in-500) / <alpha-value>)",
          light: "rgb(var(--in-50) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
        },
        paper: {
          DEFAULT: "var(--bg-page)",
          surface: "var(--bg-surface)",
          raised: "var(--bg-raised)",
          sunken: "var(--bg-sunken)",
        },
        // Legacy mappings
        teal: {
          100: "rgb(var(--cy-100) / <alpha-value>)",
          500: "rgb(var(--cy-500) / <alpha-value>)",
          700: "rgb(var(--cy-700) / <alpha-value>)",
          DEFAULT: "rgb(var(--cy-500) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-serif)", "serif"],
        editorial: ["var(--font-serif)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        xs: "var(--r-xs)",
        sm: "var(--r-sm)",
        md: "var(--r-md)",
        lg: "var(--r-lg)",
        xl: "var(--r-xl)",
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
