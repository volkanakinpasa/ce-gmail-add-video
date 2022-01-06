const { merge } = require('webpack-merge');
const common = require('./webpack.common.config');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const options = {
  mode: 'production',

  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'src/manifest.json',
          to: 'manifest.json',
        },
      ],
    }),
  ],
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({}),
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
};

const serverConfig = merge(common, options);
module.exports = serverConfig;
