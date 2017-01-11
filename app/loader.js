(function () {
  var oldAssetsIndex = JSON.parse(localStorage.getItem('assetsIndex')) || {}, assetsIndex = {};
  var progress = 0, goal = 0, DOMNodeCache = [];

  /**
   * append a <type>content</type> element into DOM's <head>
   * until no cache in the position of DOMNodeCache
   * 
   * @param {string} type 'script'|'style'
   * @param {string} content
   * @param {number} position int
   */
  function appendNode(type, content, position) {
    var node = document.createElement(type);
    node.appendChild(document.createTextNode(content));
    DOMNodeCache[position] = node;
    while(DOMNodeCache[progress]) {
      progress++;
    }
    if (progress < goal) return;
    progress = 0;
    while(DOMNodeCache[progress]) {
      document.head.appendChild(DOMNodeCache[progress++]);
    }
  }

  /**
   * remove remained assets in oldAssetsIndex, call this after calling all load()
   */
  function clearRemainedAssets() {
    for (var key in oldAssetsIndex) localStorage.removeItem('assets(' + key + ').content');
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
    var type = { 'js': 'script', 'css': 'style' }[url.split('.').pop()];
    var index = goal++;
    var contentKey = 'assets(' + url + ').content';
    var content = localStorage.getItem(contentKey);
    var localVersion = oldAssetsIndex[url];
    delete oldAssetsIndex[url];
    assetsIndex[url] = version || null;
    // if no version specified, use url as unique tag
    if ((!version || version === localVersion) && content) {
      window.setTimeout(function () {
        appendNode(type, content, index);
      }, 0);
    } else {
      var request = new XMLHttpRequest();
      request.onload = function(/* event */) {
        var content = request.responseText;
        appendNode(type, content, index);
        localStorage.setItem(contentKey, content);
      };
      request.open('get', url);
      request.send();
    }
  };

  // load('path/to/source', 'filename@@version');
  load('/assets/app.css', 'app.css@@version');
  load('/assets/vendor.js', 'vendor.js@@version');
  load('/assets/app.js', 'app.js@@version');

  localStorage.setItem('assetsIndex', JSON.stringify(assetsIndex));
  clearRemainedAssets();
})();
