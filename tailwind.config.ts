import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  darkMode: ["class"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      colors: {
        primary: "#FF724C",
        secondary: "#FDBF50",
        light: "#F4F4F8",
        dark: "#2A2C41",
      },
    },
  },
  plugins: [],
} satisfies Config;
