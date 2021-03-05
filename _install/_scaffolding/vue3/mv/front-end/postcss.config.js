const theme = require('./wb.theme.js');

// Import PostCss plugins
const autoprefixer = require('autoprefixer');
const atImport = require('postcss-import');
const customMedia = require('postcss-custom-media');
const nested = require('postcss-nested');
const purgecss = require('@fullhuman/postcss-purgecss');
const simpleVars = require('postcss-simple-vars');
const tailwind = require('tailwindcss');

// Config custom media queries
const mediaQueries = {
  importFrom: [
    () => {
      const customMedia = {};
      Object.entries(theme.mq.breakpoints).forEach(([key, value]) => {
        customMedia[`--mq-${key}`] = `(min-width: ${value}px)`;
      });

      return { customMedia };
    },
  ],
};

module.exports = {
  plugins: [
    atImport(),
    simpleVars(),
    nested(),
    customMedia(mediaQueries),
    tailwind(require('./tailwind.config.js')),
    autoprefixer(),
  ],
};
