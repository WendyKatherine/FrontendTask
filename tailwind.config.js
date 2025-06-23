/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F7F7",
        card: "#FFF3AB",
        accent: "#1efa89",
        marketcard: "#18181b",
        border: "#27272a",
        button: "#01d265",
        buttonhover: "#067e41"
      },
      fontFamily: {
        lato: ["Lato", "sans-serif"],
      },
    },
  },
  plugins: [],
};
