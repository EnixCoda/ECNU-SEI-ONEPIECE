const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const LocalStorageLoaderPlugin = require('./LocalStorageLoaderPlugin')

const src = path.resolve(__dirname, 'src')
const dist = path.resolve(__dirname, 'dist')

const extractTextWebpackPlugins = {
  loading: new ExtractTextWebpackPlugin('loading.css'),
  app: new ExtractTextWebpackPlugin('app.css'),
  materialUI: new ExtractTextWebpackPlugin({ filename: 'vendor.css', disable: !production }),
}

const production = process.env.NODE_ENV === 'production'

const plugins = [
  new HTMLWebpackPlugin({
    template: path.resolve(src, 'index.html'),
    inlineSource: 'loading.css$',
  }),
  new HtmlWebpackInlineSourcePlugin(),
  new CopyWebpackPlugin([
    path.resolve(src, 'service-worker.js'),
    path.resolve(src, 'manifest.json'),
    { from: '**/onepiece-icon-*', flatten: true },
  ]),
  extractTextWebpackPlugins.loading,
  extractTextWebpackPlugins.app,
  extractTextWebpackPlugins.materialUI,
  new LocalStorageLoaderPlugin({
    exclude: /loading.css/,
    minimize: production,
  }),
]

module.exports = {
  entry: {
    app: src,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          // name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
  output: {
    path: dist,
    publicPath: '/assets/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['env', 'react'],
            },
          },
        ],
        include: src,
      },
      {
        test: /loading\.css$/,
        use: extractTextWebpackPlugins.loading.extract({
          fallback: 'style-loader',
          use: {
            loader: 'css-loader',
            options: { minimize: production },
          },
        }),
        include: path.resolve(src, 'loading.css'),
      },
      {
        test: /\.css$/,
        use: extractTextWebpackPlugins.app.extract({
          fallback: 'style-loader',
          use: {
            loader: 'css-loader',
            options: { minimize: production },
          },
        }),
        include: path.resolve(src, 'app.css'),
      },
      {
        test: /\.css$/,
        use: extractTextWebpackPlugins.materialUI.extract({
          fallback: 'style-loader',
          use: {
            loader: 'css-loader',
            options: { minimize: production },
          },
        }),
        exclude: [path.resolve(src, 'app.css'), path.resolve(src, 'loading.css')],
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
  mode: production ? 'production' : 'development',
}
