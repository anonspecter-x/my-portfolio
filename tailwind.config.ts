import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 📌 এখানে ফন্ট ফ্যামিলি ডিক্লেয়ার করুন
      fontFamily: {
        sans: ['var(--font-montserrat)', 'sans-serif'], 
      },
    },
  },
  plugins: [],
};
export default config;