const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const nodeExternals = require('webpack-node-externals')

module.exports = merge.smart(common, {
  target: 'node', // webpack should emit node.js compatible code
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder from bundling
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'escher.js',
    library: 'escher',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              minimize: false,
              sourceMap: true
            }
          }
        ]
      },
    ],
  }
})
