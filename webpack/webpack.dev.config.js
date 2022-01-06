const { merge } = require('webpack-merge');
const common = require('./webpack.common.config');
const CopyPlugin = require('copy-webpack-plugin');
const options = {
  watchOptions: {
    poll: true,
    ignored: /node_modules/,
  },
  mode: process.env.NODE_ENV || 'development',
  devtool: 'inline-source-map',

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
};

const serverConfig = merge(common, options);
module.exports = serverConfig;
