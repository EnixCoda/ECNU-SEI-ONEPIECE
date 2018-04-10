const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const LocalStorageLoaderPlugin = require('./LocalStorageLoaderPlugin')

const src = path.resolve(__dirname, 'src')
const dist = path.resolve(__dirname, 'dist')

const production = process.env.NODE_ENV === 'production'

const extractTextWebpackPlugins = {
  loading: new ExtractTextWebpackPlugin({ filename: 'loading.css', disable: !production }),
  app: new ExtractTextWebpackPlugin({ filename: 'app.css', disable: !production }),
  materialUI: new ExtractTextWebpackPlugin({ filename: 'vendor.css', disable: !production }),
}

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
    disable: !production,
  }),
]

module.exports = {
  entry: {
    app: ['regenerator-runtime/runtime', src],
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
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['env', 'react'],
              plugins: [
                'react-hot-loader/babel',
                'transform-object-rest-spread',
              ],
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
  devtool: 'eval-source-map',
  devServer: {
    port: 8000,
    publicPath: '/assets/',
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/assets/index.html' },
        { from: /./, to: '/assets/index.html' },
      ],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:9001',
        pathRewrite: {
          '^/api': '',
        },
      },
    },
    watchOptions: {
      ignored: [/node_modules/, dist],
    },
  },
  mode: production ? 'production' : 'development',
}
