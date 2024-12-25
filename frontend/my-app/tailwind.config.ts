import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#a78bfa',
          DEFAULT: '#8b5cf6',
          dark: '#7c3aed',
          softGreen: 'rgba(64,175,105,0.92)', 
        },
        gradient: {
          from: '#8b5cf6',
          to: '#3b82f6',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
