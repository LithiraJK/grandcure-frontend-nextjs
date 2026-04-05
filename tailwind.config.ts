import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: "#005C97",
        secondary: "#53626F",
        tertiary: "#2E7D32",
        neutral: "#F5F7FA",
      },
      fontFamily: {
        display: ["var(--font-manrope)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
      boxShadow: {
        soft: "0 10px 30px -15px rgb(15 23 42 / 0.25)",
      },
    },
  },
};

export default config;
