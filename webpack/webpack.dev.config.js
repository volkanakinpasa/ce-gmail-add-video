const { merge } = require('webpack-merge');
const common = require('./webpack.common.config');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const options = {
  mode: process.env.NODE_ENV || 'development',
  devtool: 'inline-source-map',

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '..', 'src', 'dev.html'),
      filename: 'dev.html',
      chunks: ['content'],
    })
  ],
};

const serverConfig = merge(common, options);
module.exports = serverConfig;
