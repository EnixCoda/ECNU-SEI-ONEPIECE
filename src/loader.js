/* eslint-env */
module.exports = function localStorageLoader(assets) {
  var oldAssetsIndex = JSON.parse(localStorage.getItem('assetsIndex')) || {}, assetsIndex = {}
  var progress = 0, goal = 0, DOMNodeCache = []

  /**
   * try setItem for private mode in Safari
   */
  function setItem(key, data) {
    try {
      localStorage.setItem(key, data)
    } catch(err) {}
  }

  /**
   * append a <type>content</type> element into DOM's <head>
   * until no cache in the position of DOMNodeCache
   * 
   * @param {string} type 'script'|'style'
   * @param {string} content
   * @param {number} position int
   */
  function appendNode(type, content, position) {
    var node = document.createElement(type)
    node.appendChild(document.createTextNode(content))
    DOMNodeCache[position] = node
    while(DOMNodeCache[progress]) {
      progress++
    }
    if (progress === goal) {
      progress = 0
      while(DOMNodeCache[progress]) {
        document.head.appendChild(DOMNodeCache[progress++])
      }
    }
  }

  /**
   * remove remaining assets in oldAssetsIndex, call this after calling all load()
   */
  function clearRemainingAssets() {
    for (var key in oldAssetsIndex) localStorage.removeItem('assets(' + key + ').content')
  }

  /**
   * main function of this script
   * load local cache from localStorage and compare versions
   * if match and content exists, append the content
   * else, fetch it with AJAX, then append the content and save to localStorage
   * 
   * @param {string} url
   * @param {string} version
   */
  function load(url, version) {
    var type = { 'js': 'script', 'css': 'style' }[url.split('.').pop()]
    var index = goal++
    var contentKey = 'assets(' + url + ').content'
    var content = localStorage.getItem(contentKey)
    var localVersion = oldAssetsIndex[url]
    delete oldAssetsIndex[url]
    assetsIndex[url] = version || null
    // if no version specified, use url as unique tag
    if ((!version || version === localVersion) && content) {
      window.setTimeout(function() {
        appendNode(type, content, index)
      }, 0)
    } else {
      var request = new XMLHttpRequest()
      request.onload = function(/* event */) {
        var content = request.responseText
        appendNode(type, content, index)
        setItem(contentKey, content)
      }
      request.open('get', url)
      request.send()
    }
  }

  assets.forEach(function(/* [path, version] */) {
    load.apply(undefined, arguments[0])
  })
  setItem('assetsIndex', JSON.stringify(assetsIndex))
  clearRemainingAssets()
}
