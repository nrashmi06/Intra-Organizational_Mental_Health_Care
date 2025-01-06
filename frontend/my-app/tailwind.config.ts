// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: 'rgba(31, 97, 56, 0.92)',
          DEFAULT: 'rgba(15, 90, 43, 0.92)',
          dark: 'rgba(7, 71, 31, 0.92)',
          softGreen: 'rgba(64, 175, 105, 0.92)',
        },
        gradient: {
          from: '#8b5cf6',
          to: '#3b82f6',
        },
      },
    },
  },
  plugins: [],
}