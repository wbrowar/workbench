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
    })
  ],
  devServer: {
    hot: true,
    contentBase: 'dist',
    watchContentBase: true,
  },
};