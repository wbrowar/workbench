const path = require('path'),
      wb = require(`./wb.config.js`);

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
  configureWebpack: config => {
    config.resolve = {
      alias: {
        '~': path.resolve(wb.paths.starter.src),
        Components: path.resolve(wb.paths.components.src),
        CSS: path.resolve(wb.paths.css.src),
        GQL: path.resolve(`${wb.paths.starter.src}gql/`),
        JS: path.resolve(wb.paths.js.src),
        Source: path.resolve(wb.paths.starter.source),
        Starter: path.resolve(wb.paths.starter.starter),
        Views: path.resolve(`${wb.paths.starter.src}views/`),
      },
    }
  },
  chainWebpack: config => {
    // Load SCSS files for all Vue files
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
    types.forEach(type => {
      addStyleResource(config.module.rule('scss').oneOf(type));
    });
  },
  lintOnSave: wb.devMode,
  publicPath: process.env.NODE_ENV === 'production' && wb.paths.publicPath ? wb.paths.publicPath : '/',
};