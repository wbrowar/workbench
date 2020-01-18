// This is where project configuration and plugin options are located. 
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

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
  siteName: 'Gridsome',
  plugins: [
    {
      use: 'gridsome-plugin-tailwindcss',
    },
    // {
    //   use: '@gridsome/source-graphql',
    //   options: {
    //     url: process.env.CRAFT_API_URL,
    //     fieldName: 'craft',
    //     headers: {
    //       Authorization: `Bearer ${ process.env.CRAFT_AUTH_TOKEN }`
    //     },
    //   },
    // },
  ],
  chainWebpack (config) {
    // Load variables for all vue-files
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];

    // or if you use scss
    types.forEach(type => {
      addStyleResource(config.module.rule('scss').oneOf(type));
    })
  }
}
