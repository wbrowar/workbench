const env = process.env.NODE_ENV || 'development',
      fs = require('fs'),
      path = require('path'),
      varsJsonRaw = JSON.parse(fs.readFileSync('./package.json')),
      varsJsonString = JSON.stringify(varsJsonRaw),
      vars = JSON.parse(varsJsonString);

// Plugins
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// Paths
const bases = {
    source: vars.source_path,
    build:  vars.build_path,
    theme:  vars.theme_path,
    html:   vars.html_path,
    site:   vars.site_root,
};
const paths = {
    distJs: './' + bases.theme + 'js/',
    srcJs:  './' + bases.source + '_js/',
};

module.exports = {
    entry: {
        app:   paths.srcJs + "app.js",
    },
    output: {
        chunkFilename: '[id].' + vars.version + '.js',
        filename: '[name].js',
        path: path.resolve(__dirname, paths.distJs),
        publicPath: "/js/",
    },
    mode: env || 'development',
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        js: {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    ["env", {
                                        targets: {
                                            browsers: vars.browserList
                                        }
                                    }]
                                ]
                            }
                        }
                    }
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            ["env", {
                                targets: {
                                    browsers: vars.browserList
                                }
                            }]
                        ]
                    }
                }
            }
        ]
    },
    plugins: (env === 'production') ? [
        new UglifyJsPlugin({
            sourceMap: true
        })
    ] : [],
    resolve: {
        alias: {
            vue: (env === 'production') ? 'vue/dist/vue.min.js' : 'vue/dist/vue.js'
        }
    }
};