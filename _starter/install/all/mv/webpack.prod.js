// webpack plugins
const merge = require('webpack-merge');
// config files
const common = require('./webpack.common.js');

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
                        '@babel/preset-env', {
                        useBuiltIns: 'entry',
                        targets: {
                            browsers: browserList,
                        },
                    }
                    ],
                ],
                plugins: [
                    '@babel/plugin-syntax-dynamic-import',
                    '@babel/plugin-transform-runtime',
                ],
            },
        },
    };
};

// Development module exports
module.exports = [
    merge(
        common.legacyConfig,
        {
            mode: 'production',
            module: {
                rules: [
                    configureBabelLoader(Object.values(pkg.browserlist.legacy)),
                ],
            },
        }
    ),
    merge(
        common.modernConfig,
        {
            mode: 'production',
            module: {
                rules: [
                    configureBabelLoader(Object.values(pkg.browserlist.modern)),
                ],
            },
        }
    ),
];