// imports
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebappWebpackPlugin = require('webapp-webpack-plugin');

// globals
const publicDir = __dirname + '/../server/public';

// exports
module.exports = {
  entry: {
    vendor: ['./vendor/vendor.js'],
    dashboard: ['./src/index.jsx']
  },
  output: {
    publicPath: '/',
    path: publicDir,
    filename: '[name]-[hash].js'
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  plugins: [
    new WebappWebpackPlugin('./favicon.png'),
    new webpack.BannerPlugin('Copyright Fizz Inc.'),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      chunks: ['vendor', 'dashboard']
    })
  ],
  module: {
    rules: [{// components
      test: /\.(js|jsx)$/,
      use: ['babel-loader'],
      exclude: /node_modules/
    }]
  },
  devServer: {
    hot: true,
    port: '8080',
    inline: true,
    contentBase: publicDir,
    publicPath: 'http://localhost:8080/',
    historyApiFallback: {
      disableDotRule: true
    },
    headers: {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
      'Access-Control-Allow-Origin': 'https://<<FIZZ_TODO_YOUR_IAM_SERVICE_URL_HERE>>',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    }
  }
};