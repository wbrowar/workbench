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
    if (process.env.NODE_ENV === 'production') {
      // mutate config for production...
    } else {
      // mutate for development...
    }

    config.resolve = {
      alias: {
        '@$': path.resolve(__dirname, './src/'),
        Components: path.resolve(wb.paths.components.src),
        CSS: path.resolve(wb.paths.css.src),
        JS: path.resolve(wb.paths.js.src),
        Source: path.resolve(wb.paths.starter.source),
        Starter: path.resolve(wb.paths.starter.starter),
        Views: path.resolve(__dirname, './src/views/'),
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
};