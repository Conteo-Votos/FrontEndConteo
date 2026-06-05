import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        carbon: {
          900: "#111111", // Main background
          800: "#1A1A1A", // Cards
          700: "#2A2A2A", // Hover states
        },
        bronze: {
          400: "#d4af37", // Success/Active state (Golden)
          500: "#cd7f32", // Primary Bronze
          600: "#b87333", // Hover Bronze
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
      }
    },
  },
  plugins: [],
};
export default config;
