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
        primary: "#7f5af0",
        secondary: "#565e69",
        text: "#fffffe",
        border: "#383a61",
        background: "#16161a",
        primaryOffset: "#e068fd",
        textOffset: "#94a1b2",
        backgroundOffset: "#131524",
      },
    },
  },
  plugins: [require("daisyui")],
};

export default config;
