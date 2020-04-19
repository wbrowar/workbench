const autoprefixer = require('autoprefixer'),
      purgecss = require('@fullhuman/postcss-purgecss'),
      tailwind = require('tailwindcss'),
      wb = require(`./wb.config.js`);

const postcssPlugins = [
  tailwind(),
  autoprefixer(),
];

if (wb.postcss.enablePurgeCss) postcssPlugins.push(purgecss(require('./purgecss.config.js')));

module.exports = {
  plugins: postcssPlugins,
};