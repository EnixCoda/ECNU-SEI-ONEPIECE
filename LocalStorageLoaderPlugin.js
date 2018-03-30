const MD5 = require('md5')
const WebpackSource = require('webpack-sources')
const Minimize = require('minimize')
const UglifyJS = require('uglify-js')

module.exports = class LocalStorageLoaderPlugin {
  constructor(options) {
    this.options = options || {}
  }

  apply(compiler) {
    debugger

    compiler.hooks.emit.tap('LocalStorageLoaderPluginHooks', compilation => {
      const { publicPath } = compilation.options.output
      const { exclude, minimize } = this.options
      const loaderEntries = []
      const indexHTML = compilation.assets['index.html']
      if (!indexHTML) return
      let modifiedHTML = indexHTML.source()
      compilation.chunks.forEach(chunk => {
        chunk.files.forEach((file, i) => {
          if (exclude.test(file)) return
          const path = `${publicPath}${file}`
          const assetMD5 = MD5(compilation.assets[file].source())
          loaderEntries.push([path, assetMD5])
          const style =`<link href="${path}" rel="stylesheet">`
          const script = `<script type="text/javascript" src="${path}"></script>`
          modifiedHTML = modifiedHTML
            .replace(style, '')
            .replace(script, '')
        })
      })
      const loader = require('./src/loader')
      let loaderScript = `
        ${loader.toString()}
        ${loader.name}(${JSON.stringify(loaderEntries)})
      `
      if (minimize) {
        const { error, code } = UglifyJS.minify(loaderScript)
        if (code) {
          loaderScript = code
        } else {
          console.error(error)
        }
      }
      modifiedHTML = modifiedHTML.replace(`</body>`, `<script>${loaderScript}</script></body>`)

      if (minimize) {
        modifiedHTML = new Minimize().parse(modifiedHTML)
      }
      compilation.assets['index.html'] = {
        size: () => modifiedHTML.length,
        source: () => modifiedHTML,
      }
    })
  }
}
