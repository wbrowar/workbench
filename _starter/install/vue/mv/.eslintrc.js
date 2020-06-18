module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: [
    '_starter/*.js',
    '_starter/docs/**/*.js',
    '_starter/docs/**/*.vue',
    '_source/_js/automated/**/*.js',
    '_source/_js/automated/**/*.vue',
  ],
  plugins: [
    'prettier'
  ],
  // add your custom rules here
  rules: {
    'vue/attributes-order': 'off',
    'vue/no-v-html': 'off',
    'vue/order-in-components': 'off',
    'vue/require-default-prop': 'off',
  },
};
