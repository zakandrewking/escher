module.exports = {
  entry: './js/lib/devServer.js',
  devtool: 'source-map',
  devServer: {
    contentBase: './dev-server',
    open: true,
    port: 7621
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  output: 'bundle.js'
}
