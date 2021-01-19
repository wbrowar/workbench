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
    '@nuxtjs',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended'
  ],
  ignorePatterns: [
    '_wb/*.js',
    '_wb/docs/**/*.js',
    '_wb/docs/**/*.vue',
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
