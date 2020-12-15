const path = require('path');
const wb = require(`${process.cwd()}/wb.config.js`);
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    app: './_source/_css/app.pcss',
  },
  output: {
    path: path.resolve(__dirname, 'dist/')
  },
  module: {
    rules: [
      {
        test: /\.pcss$/i,
        use: [MiniCssExtractPlugin.loader, {
          loader: "css-loader",
          options: {
            sourceMap: false,
            url: false,
            import: false,
          },
        }, {
          loader: "postcss-loader",
          options: {
            sourceMap: false,
          },
        }],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      filename: `index.html`,
      template: `${process.cwd()}/_source/_html/index.ejs`,
      inject: process.env.NODE_ENV !== 'production',
      minify: false,
      publicPath: process.env.NODE_ENV === 'production' ? process.env.PUBLIC_PATH : '/',
      templateParameters: {
        isProduction: process.env.NODE_ENV === 'production',
        publicPath: process.env.PUBLIC_PATH,
      }
    })
  ],
  devServer: {
    hot: true,
    contentBase: 'dist',
    watchContentBase: true,
  },
};