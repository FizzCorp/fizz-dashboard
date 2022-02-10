// imports
const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackConfig = require('./webpack.config');

// exports
module.exports = merge(webpackConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [{// fonts
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: ['file-loader']
    },
    { // images
      test: /\.(png|svg|jpg|gif)$/,
      use: ['file-loader']
    },
    { // styling
      test: /\.css$/,
      use: ['style-loader',
        {
          loader: 'css-loader',
          options: { sourceMap: true }
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => [require('postcss-preset-env')({
              stage: 3,
              browsers: 'last 4 versions',
              autoprefixer: { 'remove': false }, // faster if not processing legacy css
              features: { 'nesting-rules': true }
            })]
          }
        }]
    },
    {
      test: /\.scss$/,
      use: ['style-loader',
        {
          loader: 'css-loader',
          options: { sourceMap: true }
        },
        {
          loader: 'sass-loader', // compiles Sass to CSS
          options: {
            sourceMap: true,
            includePaths: ['./node_modules/'],
            implementation: require('dart-sass')
          }
        }]
    }]
  }
});