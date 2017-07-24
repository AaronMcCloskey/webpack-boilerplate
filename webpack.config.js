//NPM
var path = require('path');
var webpack = require('webpack');
var pkg = require('./package.json');

//Plugins
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var extractPlugin = new ExtractTextPlugin({
    filename: 'main.css'
});

// bundle dependencies in separate vendor bundle
var vendorPackages = Object.keys(pkg.dependencies).filter(function(el) {
    var excludes = [
        // 'datatables',
    ];

    for (var i = 0; i < excludes.length; i++) {
        if (el.indexOf(excludes[i]) > -1) {
            return false;
        }
    }

    return true;
});

module.exports = {
    entry: {
        app: './src/js/app.js',
        alert: './src/js/alert.js',
        vendor: vendorPackages,
        mainLayout: './src/js/styles.js',
    },
    devtool: 'eval',
    devServer: {
        contentBase: './dist',
        host: 'localhost',
        port: 8080,
        hot: true,
        noInfo: false,
        inline: true
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    module: {
        rules: [{ test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/, include: __dirname },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.sass$/,
                use: extractPlugin.extract({
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.html$/,
                use: ['html-loader']
            },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
            { test: /\.(jpg|gif)$/, loader: 'file-loader', include: __dirname },
            { test: /\.png$/, loader: 'url-loader?limit=100000', include: __dirname }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
        }),
        extractPlugin,
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html',
            chunks: [
                'app',
                'vendor',
                'mainLayout'
            ]
        }),
        new HtmlWebpackPlugin({
            filename: 'test.html',
            template: 'src/test.html',
            chunks: [
                'alert',
                'vendor',
                'mainLayout'
            ]
        }),
        new CleanWebpackPlugin(['dist']),
        new webpack.HotModuleReplacementPlugin()
    ]
};