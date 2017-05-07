var nodeExternals = require('webpack-node-externals');
var path = require('path');

module.exports = {
  entry: {
    express: path.resolve(__dirname, '../src/server/express'),
    hapi: path.resolve(__dirname, '../src/server/hapi')
  },
  output: {
    path: path.resolve(__dirname, '../dist/server'),
    filename: '[name].js',
    library: '',
    libraryTarget: 'commonjs2'
  },
  target: 'node',
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
  externals: [nodeExternals()]
};
