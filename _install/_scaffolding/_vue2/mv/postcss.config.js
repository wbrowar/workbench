const path = require('path');

// Load custom pieces
// const functionFunctions = require('./_source/_css/_css.functions.mjs'),
//       mixinsMixins = require('./_source/_css/_css.mixins.js');
const wb = require('./wb.config.js');

// Import PostCss plugins
const autoprefixer = require('autoprefixer'),
      easyImport = require('postcss-easy-import'),
      customMedia = require('postcss-custom-media'),
      // functions = require('postcss-functions'),
      // mixins = require('postcss-mixins'),
      nested = require('postcss-nested'),
      purgecss = require('@fullhuman/postcss-purgecss'),
      simpleVars = require('postcss-simple-vars'),
      tailwind = require('tailwindcss');

// Config custom media queries
const mediaQueries = {
  importFrom: [() => {
    const customMedia = {};
    Object.entries(wb.mq).forEach(([key, value]) => {
      customMedia[`--mq-${key}`] = `(min-width: ${value}px)`;
    });

    return { customMedia };
  }],
}

const postcssPlugins = [
  simpleVars(),
  easyImport(),
  // mixins({ mixins: mixinsMixins }),
  // functions({ functions: functionFunctions }),
  nested(),
  customMedia(mediaQueries),
  tailwind(),
  autoprefixer(),
];

if (process.env.NODE_ENV === 'production' && process.env.VUE_APP_POSTCSS_PURGECSS === 'true')
  postcssPlugins.push(purgecss(require('./purgecss.config.js')));

module.exports = {
  plugins: postcssPlugins,
};
