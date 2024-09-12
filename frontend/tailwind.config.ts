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
        primary: "#131524",
        secondary: "#565e69",
        border: "#383a61",
        background: "#fff0b5",
        primaryOffset: "#e068fd",
        textOffset: "#94a1b2",
        backgroundOffset: "#131524",
        navbar:"#fdc318",
        card:"#f7d986",
      },
    },
  },
  plugins: [require("daisyui")],
};

export default config;
