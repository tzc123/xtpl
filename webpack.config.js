const path = require('path')
const CleanPlugin = require('clean-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  entry: {
    xtpl: path.join(__dirname, 'xtpl.js')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name][chunkhash].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
            plugins: ['transform-object-rest-spread']
          }
        }
      }
    ]
  },
  plugins: [
    new CleanPlugin(path.join(__dirname, 'dist')),
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlPlugin({
      template: path.join(__dirname, 'index.html'),
      path: path.join(__dirname, 'dist')
    })
  ]
}