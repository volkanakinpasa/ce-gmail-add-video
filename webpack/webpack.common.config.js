const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const publicPath = '/';

const output = {
  filename: '[name].bundle.js',
  path: path.join(__dirname, '..', 'dist'),
  publicPath,
};

const config = {
  entry: {
    options: path.join(__dirname, '..', 'src', 'js', 'option', 'index.tsx'),
    background: path.join(__dirname, '..', 'src', 'js', 'background.ts'),
    content: path.join(__dirname, '..', 'src', 'js', 'content', 'content.tsx'),
    form: path.join(__dirname, '..', 'src', 'js', 'content', 'form.tsx'),
  },
  target: 'web',
  output,
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          { loader: 'style-loader', options: { injectType: 'styleTag' } },
          'css-loader',
          'sass-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['to-string-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader'],
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3)$/,
        use: 'file-loader?name=media/[name].[ext]',
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['*', '.tsx', '.ts', '.js', '.css'],
  },
  plugins: [
    // expose and write the allowed env vars on the compiled bundle
    new CleanWebpackPlugin(),
    new ProgressBarPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '..', 'src', 'options.html'),
      filename: 'options.html',
      chunks: ['options'],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '..', 'src', 'background.html'),
      filename: 'background.html',
      chunks: ['background'],
    }),
    // new WriteFilePlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '..', 'src', 'js', 'content', 'form.html'),
      filename: 'form.html',
      chunks: ['form'],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'src/resources',
          to: '',
        },
      ],
    }),
    // new BundleAnalyzerPlugin(),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};
module.exports = config;
