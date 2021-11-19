module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: ['@nuxtjs/eslint-config-typescript', 'prettier', 'plugin:prettier/recommended', 'plugin:nuxt/recommended'],
  ignorePatterns: ['node_modules/*', '_wb/*.js', '_source/_js/automated/**/*.js', '_source/_js/automated/**/*.vue'],
  plugins: ['prettier'],
  rules: {
    camelcase: 'off',
    'no-use-before-define': 'off',
    'vue/attributes-order': 'off',
    'vue/no-v-html': 'off',
    'vue/order-in-components': 'off',
    'vue/require-default-prop': 'off',
  },
};
