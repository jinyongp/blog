/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./{content,layouts,static}/**/*.{html,md,css,js}"],
  theme: {
    extend: {
      colors: {
        accent: "rgb(var(--accent) / <alpha-value>)",
      },
      width: (theme) => theme("maxWidth"),
      height: (theme) => theme("maxHeight"),
    },
  },
  plugins: [
    require("tailwindcss-debug-screens"),
    require("tailwindcss-safe-area"),
  ],
};
