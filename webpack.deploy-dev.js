const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge.smart(common, {
    mode: 'development', // Force development mode (like npm start)
    entry: './dev-server/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js' // Same filename as local dev
    },
    devtool: 'source-map', // Keep source maps
    plugins: [
        // We still need to generate the HTML file, but we will use the dev-server template
        // to match local behavior as closely as possible.
        new HtmlWebpackPlugin({
            title: 'Escher',
            template: './dev-server/index.html', // Use the EXACT same template as local
            filename: 'index.html',
            inject: false
        })
    ],
    // Ensure node_modules are transpiled to avoid "illegal character" errors even in dev mode
    // if they appear on some browsers. But strictly speaking, "mode: development" usually avoids minification errors.
    externals: {
        '@jupyter-widgets/base': 'JupyterWidgets'
    }
})
