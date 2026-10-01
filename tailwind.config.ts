import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base surfaces
        paper: "#F6F5F1",
        ink: "#0B1120",
        surface: {
          light: "#FFFFFF",
          dark: "#111A2E",
        },
        // Data-science signal accent (electric signal teal)
        signal: {
          50: "#EBFDF9",
          100: "#CFFAF0",
          300: "#7FEBD6",
          400: "#3FDDC0",
          500: "#1CC7A8",
          600: "#149C85",
          700: "#0F7565",
        },
        // Secondary accent - amber, used sparingly for highlights/warnings/awards
        amber: {
          400: "#F5B942",
          500: "#EFA321",
        },
        border: {
          light: "#E4E2DB",
          dark: "#22304A",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "grid-light":
          "linear-gradient(to right, #00000008 1px, transparent 1px), linear-gradient(to bottom, #00000008 1px, transparent 1px)",
        "grid-dark":
          "linear-gradient(to right, #ffffff0a 1px, transparent 1px), linear-gradient(to bottom, #ffffff0a 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "32px 32px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        blink: "blink 1s step-end infinite",
      },
    },
  },
  plugins: [],
};
export default config;
