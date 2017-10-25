const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const nodeExternals = require('webpack-node-externals')

module.exports = merge.smart(common, {
 // Webpack should emit node.js compatible code
  target: 'node',
 // Ignore all modules in node_modules folder from bundling
  externals: [nodeExternals()]
})
