import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bni: {
          primary: "#CC0000",
          dark: "#AA0000",
          light: "#FFEAEA",
        },
        sidebar: "#16161A",
        danger: "#DC2626",
        success: "#16A34A",
        warning: "#F59E0B",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(17 24 39 / 0.04), 0 1px 3px 0 rgb(17 24 39 / 0.04)",
        soft: "0 1px 2px 0 rgb(17 24 39 / 0.04)",
        card: "0 1px 2px 0 rgb(17 24 39 / 0.04), 0 6px 16px -8px rgb(17 24 39 / 0.10)",
        "card-hover": "0 18px 40px -16px rgb(17 24 39 / 0.25)",
        elevated: "0 24px 56px -20px rgb(17 24 39 / 0.30)",
        glow: "0 8px 24px -8px rgb(204 0 0 / 0.45)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      backgroundImage: {
        "sidebar-gradient": "linear-gradient(180deg, #242429 0%, #141417 100%)",
        "brand-gradient": "linear-gradient(135deg, #E11D2A 0%, #CC0000 55%, #AA0000 100%)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.35s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
