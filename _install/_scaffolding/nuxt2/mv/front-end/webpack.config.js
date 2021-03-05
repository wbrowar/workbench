/* Use this to register Webpack aliases for autocomplete in PhpStorm
 * NOTE: this files does not register these to Webpack and all of these aliases should match those found in your project’s Webpack config
 *
 * Setup:
 * 1. In PhpStorm, go to Preferences > Languages & Frameworks > Javascript > Webpack
 * 2. Put the path to this file in the `webpack configuration file` field and save
 *
 * Usage: import MediaImage from 'Components/MediaImage.vue';
 */

module.exports = {
  resolve: {
    alias: {
      Components: path.resolve(__dirname, '../_source/_components/'),
      CSS: path.resolve(__dirname, '../_source/_css/'),
      GQL: path.resolve(__dirname, '../gql/'),
      Layouts: path.resolve(__dirname, '../layouts/'),
      Pages: path.resolve(__dirname, '../pages/'),
      JS: path.resolve(__dirname, '../_source/_js/'),
      Source: path.resolve(__dirname, '../_source/'),
      WB: path.resolve(__dirname, '../_wb/'),
    },
  },
};
