const path = require('path');

function addStyleResource (rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './_source/_css/automated/_colors.scss'),
        path.resolve(__dirname, './_source/_css/automated/_fonts.scss'),
        path.resolve(__dirname, './_source/_css/base/_functions.scss'),
        path.resolve(__dirname, './_source/_css/base/_variables.scss'),
        path.resolve(__dirname, './_source/_css/base/_mixins.scss'),
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
        Components: path.resolve(__dirname, './_source/_components/'),
        CSS: path.resolve(__dirname, './_source/_css/'),
        JS: path.resolve(__dirname, './_source/_js/'),
        Starter: path.resolve(__dirname, './_starter/'),
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