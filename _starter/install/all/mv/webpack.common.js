// node modules
const merge = require('webpack-merge'),
      path  = require('path');

// webpack plugins
const ManifestPlugin  = require('webpack-manifest-plugin'),
      VueLoaderPlugin = require('vue-loader/lib/plugin');

// config files
const pkg = require('./package.json');


// CONFIGURE LOADERS
// SCSS loader
const configureScssLoader = () => {
    return {
        test: /\.(scss|css)$/,
        use: [
            'vue-style-loader',
            'css-loader',
            'sass-loader'
        ]
    };
};

// Vue loader
const configureVueLoader = () => {
    return {
        test: /\.vue$/,
        loader: 'vue-loader'
    };
};

// CONFIG PROFILES
// The base webpack config
const baseConfig = {
    name: pkg.name,
    entry: () => {
        let entries = {};

        // js files
        for (const [key, value] of Object.entries(pkg.webpack.entries.js)) {
            entries[key] = path.resolve(__dirname, pkg.paths.base.src + pkg.paths.js.src + value);
        }

        return entries;
    },
    output: {},
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    module: {
        rules: [
            configureScssLoader(),
            configureVueLoader(),
        ],
    },
    optimization: {
        splitChunks: {},
    },
    plugins: [
        new VueLoaderPlugin(),
    ]
};

// Legacy webpack config
const legacyConfig = {
    output: {
        filename: 'legacy',
    },
};

// Modern webpack config
const modernConfig = {
    output: {
        filename: 'modern',
    },
};

// Common module exports
module.exports = {
    'legacyConfig': merge(
        legacyConfig,
        baseConfig,
    ),
    'modernConfig': merge(
        modernConfig,
        baseConfig,
    ),
};