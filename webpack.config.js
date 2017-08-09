const path = require('path')

module.exports = {
  entry: './js/lib/main.js',
  output: {
    path: path.resolve(__dirname, 'js/dist'),
    filename: 'escher.js',
    libraryTarget: 'umd'
  },
  devtool: 'source-map'
}
