const path = require('path')

const src = path.resolve(__dirname, 'src')
const dist = path.resolve(__dirname, 'dist')

module.exports = {
  entry: {
    app: src,
  },
  output: {
    path: dist,
    filename: '[name].[hash].js',
  },
  module: {
    rules: []
  }
}
