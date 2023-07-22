module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-nesting'),
    require('tailwindcss'),
    require('autoprefixer'),
    require('@csstools/postcss-is-pseudo-class')
  ]
}
