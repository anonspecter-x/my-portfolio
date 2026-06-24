import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // 🌙 ডার্ক মোড কাজ করার জন্য এই লাইনটি সবচেয়ে জরুরি
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"], 
  },
};
export default config;