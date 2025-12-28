const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge.smart(common, {
    mode: 'production',
    entry: {
        'escher': './dev-server/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    optimization: {
        minimizer: []
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Escher',
            template: './deploy-template.html',
            filename: 'index.html',
            inject: 'body',
            meta: {
                'viewport': 'width=device-width, initial-scale=1, shrink-to-fit=no'
            }
        })
    ],
    // Override module rules to include node_modules in babel transpilation
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.jsx?$/,
                // Remove exclude: /node_modules/ to transpile everything
                loader: ['babel-loader']
            },
            // Embed font Definitions
            {
                test: /\.svg$/,
                loader: 'url-loader?limit=65000&mimetype=image/svg+xml&name=public/fonts/[name].[ext]'
            },
            {
                test: /\.woff$/,
                loader: 'url-loader?limit=65000&mimetype=application/font-woff&name=public/fonts/[name].[ext]'
            },
            {
                test: /\.woff2$/,
                loader: 'url-loader?limit=65000&mimetype=application/font-woff2&name=public/fonts/[name].[ext]'
            },
            {
                test: /\.[ot]tf$/,
                loader: 'url-loader?limit=65000&mimetype=application/octet-stream&name=public/fonts/[name].[ext]'
            },
            {
                test: /\.eot$/,
                loader: 'url-loader?limit=65000&mimetype=application/vnd.ms-fontobject&name=public/fonts/[name].[ext]'
            }
        ]
    },
    externals: {
        '@jupyter-widgets/base': 'JupyterWidgets'
    }
})
