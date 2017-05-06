var path = require('path');
var UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: [
    path.resolve(__dirname, '../src/client')
  ],
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'client.min.js'
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/],
        loader: 'babel-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  devtool: 'source-map',
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      minimize: true,
      sourceMap: true
    }),
    new UnminifiedWebpackPlugin()
  ],
  externals: [nodeExternals()]
};
