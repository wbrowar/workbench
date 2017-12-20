const env = process.env.NODE_ENV || 'dev',
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
        path: path.resolve(__dirname, paths.distJs),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        js: 'babel-loader'
                    }
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
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