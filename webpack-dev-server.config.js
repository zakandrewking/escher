const path = require('path')

module.exports = {
  entry: './dev-server/index.js',
  devtool: 'source-map',
  devServer: {
    contentBase: './dev-server',
    open: true,
    port: 7621
  },
  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, "js/src"),
      path.resolve(__dirname, "js/lib")
    ],
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: ['babel-loader']
      }
    ]
  },
  output: 'bundle.js'
}
