const nodeExternals = require('webpack-node-externals')
const path = require('path')
const process = require('process')
const webpack = require('webpack')
const package = require('./package.json')
const isCoverage = process.env.NODE_ENV === 'coverage'

const loaders = [
  {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    loader: ['babel-loader']
  },
  {
    include: path.resolve(__dirname, 'node_modules/font-awesome/css/font-awesome.css'),
    loader: 'null-loader'
  },
  {
    test: /\.css?$/,
    loader: 'null-loader'
  }
]

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  plugins: [
    new webpack.DefinePlugin({
      ESCHER_VERSION: JSON.stringify(package.version)
    })
  ],
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
    isCoverage
      ? [
        {
          test: /\.jsx?$/,
          include: path.resolve(__dirname, 'src'),
          enforce: 'post',
          use: ['istanbul-instrumenter-loader']
        },
        ...loaders
      ]
      : loaders
  },
  devtool: 'inline-cheap-module-source-map'
}
