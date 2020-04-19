// This is where project configuration and plugin options are located. 
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const autoprefixer = require('autoprefixer'),
      path = require('path'),
      purgecss = require('@fullhuman/postcss-purgecss'),
      tailwind = require('tailwindcss'),
      wb = require(`./wb.config.js`);

const postcssPlugins = [
  tailwind(),
  autoprefixer(),
];

if (wb.postcss.enablePurgeCss) postcssPlugins.push(purgecss(require('./purgecss.config.js')));

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
  plugins: [
    // {
    //   use: '@gridsome/source-graphql',
    //   options: {
    //     url: process.env.VUE_APP_CRAFT_API_URL,
    //     fieldName: 'craft',
    //     headers: {
    //       Authorization: `Bearer ${ process.env.VUE_APP_CRAFT_AUTH_TOKEN }`
    //     },
    //   },
    // },
  ],
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
