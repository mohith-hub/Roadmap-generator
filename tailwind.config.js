/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blueCustom: "#106EBE", // Exact blue color you provided
        mintCustom: "#0FFCBE", // Exact mint color you provided
        // Removed grayCustom and lightGrayCustom to strictly use blue and mint
      },
    },
  },
  plugins: [],
};