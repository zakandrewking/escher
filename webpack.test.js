const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const nodeExternals = require('webpack-node-externals')
const path = require('path')
const process = require('process')
const isCoverage = process.env.NODE_ENV === 'coverage'

// Overrides css loader from common
const cssNullLoader = {
  test: /\.css$/,
  loader: 'null-loader'
}

// For coverage
const istanbulLoader = {
  test: /\.jsx?$/,
  include: path.resolve(__dirname, 'src'),
  enforce: 'post',
  use: ['istanbul-instrumenter-loader']
}
const rules = isCoverage ? [istanbulLoader, cssNullLoader] : [cssNullLoader]

module.exports = merge.smart(common, {
  mode: 'development',
 // Webpack should emit node.js compatible code
  target: 'node',
  // Ignore all modules in node_modules folder from bundling
  externals: [nodeExternals({
    whitelist: ['font-awesome/css/font-awesome.min.css']
  })],
  output: {
    // filename: 'bundle.js', // for testing
    // use absolute paths in sourcemaps (important for debugging via IDE)
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
  },
  entry: './src/main.js',
  module: { rules: rules },
  devtool: 'inline-cheap-module-source-map'
})
