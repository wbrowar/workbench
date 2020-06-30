const autoprefixer = require('autoprefixer'),
  purgecss = require('@fullhuman/postcss-purgecss'),
  tailwind = require('tailwindcss');

const postcssPlugins = [tailwind(), autoprefixer()];

if (process.env.NODE_ENV === 'production' && process.env.VUE_APP_POSTCSS_PURGECSS === 'true')
  postcssPlugins.push(purgecss(require('./purgecss.config.js')));

module.exports = {
  plugins: postcssPlugins,
};
