const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        danger: "#c10000",
        primary: "#191919",
        success: "#38BDF8"
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()]
}

