module.exports = {
  root: true,

  env: {
    browser: true,
    node: true,
  },

  parserOptions: {
    parser: 'babel-eslint',
  },

  ignorePatterns: [
    '_wb/*.js',
    '_wb/docs/**/*.js',
    '_wb/docs/**/*.vue',
  ],

  plugins: ['prettier'],

  // add your custom rules here
  rules: {
    'vue/attributes-order': 'off',
    'vue/no-v-html': 'off',
    'vue/order-in-components': 'off',
    'vue/require-default-prop': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },

  extends: [
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/prettier',
  ],
};
