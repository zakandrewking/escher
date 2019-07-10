const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

// to visualize the webpack bundle contents:
// yarn add -D webpack-bundle-analyzer
// yarn build
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = merge.smart(common, {
  mode: 'production',
  entry: {
    'escher': './src/main.js',
    'escher.min': './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: 'escher',
    libraryTarget: 'umd'
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        include: /\.min\.js$/,
        sourceMap: true
      })
    ]
  },
  // plugins: [new BundleAnalyzerPlugin()],
  externals: ['@jupyter-widgets/base']
})
