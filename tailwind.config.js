/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "jet": "#333333",
        "navy": "#233A6C",
        "gas-pedal": "#FDB035",
        "smoke": "#F5F5F5",
        "sea-salt": "#F6F6F6"
      }
    },
  },
  plugins: [],
}
