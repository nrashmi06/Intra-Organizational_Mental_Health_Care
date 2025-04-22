/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx,html}", 
    "./src/components/**/*.{js,ts,jsx,tsx,mdx,html}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx,html}",
    "./public/**/*.html", 
    "./src/**/*.css", 
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: 'rgba(31, 97, 156, 0.92)',  // Lighter Blue
          DEFAULT: 'rgba(15, 70, 147, 0.92)', // Default Blue
          dark: 'rgba(7, 46, 108, 0.92)',    // Darker Blue
          softBlue: 'rgba(64, 175, 255, 0.92)', // Softer Blue
        },
        gradient: {
          from: '#8b5cf6',  // Purple (starting point of gradient)
          to: '#3b82f6',    // Blue (ending point of gradient)
        },
      },
    },
  },
  plugins: [],
}
