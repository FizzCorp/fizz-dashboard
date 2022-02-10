// imports
const merge = require('webpack-merge');
const webpackConfig = require('./webpack.config');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// exports
module.exports = merge(webpackConfig, {
  mode: 'production',
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
  },
  plugins: [
    new MiniCssExtractPlugin({
      chunkFilename: '[id].css',
      filename: '[name]-[hash].css'
    })
  ],
  module: {
    rules: [{// fonts
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: ['file-loader?outputPath=fonts/']
    },
    { // images
      test: /\.(png|svg|jpg|gif)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 100000,
          fallback: 'file-loader?outputPath=images/'
        }
      }]
    },
    { // styling
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader', {
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
      use: [MiniCssExtractPlugin.loader, 'css-loader', {
        loader: 'sass-loader', // compiles Sass to CSS
        options: {
          includePaths: ['./node_modules/'],
          implementation: require('dart-sass')
        }
      }]
    }]
  }
});