/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./views/*.ejs"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
        "Montserrat": ["Montserrat", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("tailwindcss"), require("autoprefixer")],
};
