const { merge } = require('webpack-merge');
const common = require('./webpack.common.config');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const options = {
  mode: 'production',

  plugins: [new CleanWebpackPlugin()],
  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin({})],
  },
};

const serverConfig = merge(common, options);
module.exports = serverConfig;
