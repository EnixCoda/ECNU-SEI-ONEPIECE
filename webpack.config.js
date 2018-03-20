const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')

const src = path.resolve(__dirname, 'src')
const dist = path.resolve(__dirname, 'dist')

module.exports = {
  entry: {
    app: src,
  },
  output: {
    path: dist,
    publicPath: '/assets/',
    filename: '[name].[hash].js',
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
        test: /\.css$/,
        use: ExtractTextWebpackPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        }),
      },
      { test: /\.html$/, use: 'raw-loader' },
      { test: /\.woff2?$/, use: 'file-loader' },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(src, 'index.html'),
    }),
    new ExtractTextWebpackPlugin('app.css'),
  ],
}
