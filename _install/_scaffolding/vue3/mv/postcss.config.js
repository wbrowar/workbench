const theme = require('./wb.theme.js');

// Import PostCss plugins
const autoprefixer = require('autoprefixer');
const easyImport = require('postcss-easy-import');
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

const postcssPlugins = [
  simpleVars(),
  easyImport(),
  nested(),
  customMedia(mediaQueries),
  tailwind(require('./tailwind.config.js')),
  autoprefixer(),
];

if (process.env.NODE_ENV === 'production' && process.env.VUE_APP_POSTCSS_PURGECSS === 'true')
  postcssPlugins.push(purgecss(require('./purgecss.config.js')));

module.exports = {
  plugins: postcssPlugins,
};
