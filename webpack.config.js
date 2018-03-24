const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const LocalStorageLoaderPlugin = require('./LocalStorageLoaderPlugin')

const src = path.resolve(__dirname, 'src')
const dist = path.resolve(__dirname, 'dist')

const ExtractTextWebpackPluginLoading = new ExtractTextWebpackPlugin('loading.css')
const ExtractTextWebpackPluginApp = new ExtractTextWebpackPlugin('app.css')

const production = process.env.NODE_ENV === 'production'
 
const plugins = [
  new HTMLWebpackPlugin({
    template: path.resolve(src, 'index.html'),
    inlineSource: 'loading\.css$',
  }),
  new HtmlWebpackInlineSourcePlugin(),
  new CopyWebpackPlugin([
    path.resolve(src, 'service-worker.js'),
    path.resolve(src, 'manifest.json'),
    { from: '**/onepiece-icon-*', flatten: true },
  ]),
  ExtractTextWebpackPluginLoading,
  ExtractTextWebpackPluginApp,
  new LocalStorageLoaderPlugin({
    exclude: /loading.css/,
    minimize: production,
  }),
]

module.exports = {
  entry: {
    app: src,
  },
  output: {
    path: dist,
    publicPath: '/assets/',
    // filename: '[name].[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['env'],
              plugins: ['angularjs-annotate'],
            },
          },
        ],
        include: src,
      },
      {
        test: /loading\.css$/,
        use: ExtractTextWebpackPluginLoading.extract({
          fallback: 'style-loader',
          use: {
            loader: 'css-loader',
            options: { minimize: production },
          },
        }),
        include: path.resolve(src, 'loading.css')
      },
      {
        test: /\.css$/,
        use: ExtractTextWebpackPluginApp.extract({
          fallback: 'style-loader',
          use: {
            loader: 'css-loader',
            options: { minimize: production },
          },
        }),
        exclude: path.resolve(src, 'loading.css')
      },
      { test: /\.html$/, use: 'raw-loader' },
      {
        test: /\.woff2?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
        },
      },
    ],
  },
  plugins,
}
