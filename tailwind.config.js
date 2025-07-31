/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#f9fafb",
        foreground: "#1f2937",
        border: "#e5e7eb"
      }
    },
  },
  plugins: [],
}
