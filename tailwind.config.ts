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
        background: "#0B0E14",
        surface: "#111721",
        accent: {
          DEFAULT: "#1466D6",
          dark: "#0F4FA8",
        },
      },
      backgroundImage: {
        "gradient-accent": "linear-gradient(90deg, #1466D6 0%, #5FA8F5 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
