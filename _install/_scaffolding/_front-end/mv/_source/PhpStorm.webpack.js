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
            '~': path.resolve(__dirname, '../src/'),
            Components: path.resolve(__dirname, '../_source/_components/'),
            CSS: path.resolve(__dirname, '../_source/_css/'),
            JS: path.resolve(__dirname, '../_source/_js/'),
            Starter: path.resolve(__dirname, '../_starter/'),
            Views: path.resolve(__dirname, '../src/views/'),
        }
    }
};