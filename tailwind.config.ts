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
        card: "0 1px 3px 0 rgb(17 24 39 / 0.05), 0 1px 2px -1px rgb(17 24 39 / 0.04)",
        "card-hover": "0 14px 32px -12px rgb(17 24 39 / 0.2)",
        glow: "0 8px 24px -8px rgb(204 0 0 / 0.45)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      backgroundImage: {
        "sidebar-gradient": "linear-gradient(180deg, #242429 0%, #141417 100%)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.3s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
