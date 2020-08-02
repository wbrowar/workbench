// This is where project configuration and plugin options are located. 
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const autoprefixer = require('autoprefixer'),
  path = require('path'),
  tailwind = require('tailwindcss'),
  wb = require(`./wb.config.js`);

// Gridsome setup
const gridsomePlugins = [];

// Adds Ben Sheedy’s Craft CMS (GraphQL) plugin if using CraftCMS
if (process.env.GRIDSOME_CRAFT_API_URL) {
  let soureCraftGraphqlHeaders = process.env.CRAFT_AUTH_TOKEN ? { Authorization: `Bearer ${ process.env.CRAFT_AUTH_TOKEN }` } : null;

  gridsomePlugins.push({
    use: '@bhws/gridsome-source-craft-graphql',
    options: {
      url: process.env.GRIDSOME_CRAFT_API_URL,
      fieldName: 'craft',
      typeName: 'craft',
      headers: soureCraftGraphqlHeaders,
      livePreview: process.env.GRIDSOME_LIVE_PREVIEW || false,
    }
  });
}

// PostCSS setup
const postcssPlugins = [
  tailwind(),
  autoprefixer(),
];

function addStyleResource (rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(`${wb.paths.css.src}automated/_colors.scss`),
        path.resolve(`${wb.paths.css.src}automated/_fonts.scss`),
        path.resolve(`${wb.paths.css.src}base/_functions.scss`),
        path.resolve(`${wb.paths.css.src}base/_variables.scss`),
        path.resolve(`${wb.paths.css.src}base/_mixins.scss`),
      ],
    })
}

module.exports = {
  siteName: 'Gridsome',
  plugins: gridsomePlugins,
  css: {
    loaderOptions: {
      postcss: {
        plugins: postcssPlugins,
      },
    },
  },
  chainWebpack (config) {
    // Load variables for all vue-files
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];

    // or if you use scss
    types.forEach(type => {
      addStyleResource(config.module.rule('scss').oneOf(type));
    })
  }
}