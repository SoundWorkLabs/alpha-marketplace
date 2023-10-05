/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navBgColor: "#121426",
        backgroundColor: "#020415",
        textColor: "#ffffff",
        footerBgColor: "#0B0D1D",
      },
    },
  },
  plugins: [],
};
