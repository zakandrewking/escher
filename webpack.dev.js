const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge.smart(common, {
  entry: './dev-server/index.js',
  output: 'bundle.js',
  devServer: {
    contentBase: './dev-server',
    open: true,
    port: 7621
  }
})
