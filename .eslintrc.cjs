/*!
 * config file for `eslint`
 *
 * update: wget -O .eslintrc.js https://git.io/fjVjK
 * document: https://eslint.org/docs/user-guide/configuring
 */

/* @fisker/eslint-config https://git.io/fjOeH */

module.exports = {
  root: true,
  env: {},
  parserOptions: {
    parseOptions: {
      allowAwaitOutsideFunction: true,
    },
  },
  extends: ['@fisker'],
  settings: {},
  rules: {},
  plugins: [],
  globals: {},
  overrides: [],
}
