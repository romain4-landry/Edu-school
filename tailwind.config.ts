import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0F0E",
        surface: "#111716",
        accent: {
          DEFAULT: "#00E5A0",
          dark: "#00B37D",
        },
      },
      backgroundImage: {
        "gradient-accent": "linear-gradient(90deg, #00E5A0 0%, #5FF5C4 100%)",
      },
    },
  },
  plugins: [],
};

export default config;