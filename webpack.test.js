const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const nodeExternals = require('webpack-node-externals')
const path = require('path')
const process = require('process')
const isCoverage = process.env.NODE_ENV === 'coverage'

module.exports = merge.smart(common, {
 // Webpack should emit node.js compatible code
  target: 'node',
 // Ignore all modules in node_modules folder from bundling
  externals: [nodeExternals()],
  output: {
    // filename: 'bundle.js', // for testing
    // use absolute paths in sourcemaps (important for debugging via IDE)
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
  },
  entry: './src/main.js',
  module: {
    rules: isCoverage
      ? [ {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, 'src'),
        enforce: 'post',
        use: ['istanbul-instrumenter-loader']
        } ]
      : []
  },
  devtool: 'inline-cheap-module-source-map'
})
