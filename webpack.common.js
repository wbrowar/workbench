// node modules
const merge = require('webpack-merge'),
      path  = require('path');

// webpack plugins
const ManifestPlugin       = require('webpack-manifest-plugin'),
      VueLoaderPlugin      = require('vue-loader/lib/plugin');

// config files
const pkg = require('./package.json');


// CONFIGURE LOADERS
// Babel loader
const configureBabelLoader = (browserList) => {
    return {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: [
                    [
                        'env', {
                        modules: false,
                        useBuiltIns: true,
                        targets: {
                            browsers: browserList,
                        },
                    }
                    ],
                ],
                plugins: [
                    'syntax-dynamic-import',
                    [
                        "transform-runtime", {
                            "polyfill": false,
                            "regenerator": true
                        }
                    ]
                ],
            },
        },
    };
};

// SCSS loader
const configureScssLoader = () => {
    return {
        test: /\.scss$/,
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
    module: {
        rules: [
            configureBabelLoader(Object.values(pkg.browserlist.legacy)),
        ],
    },
};

// Modern webpack config
const modernConfig = {
    output: {
        filename: 'modern',
    },
    module: {
        rules: [
            configureBabelLoader(Object.values(pkg.browserlist.modern)),
        ],
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