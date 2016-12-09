(function () {
  var preserves = ['notFirstTime'];
  var progress = 0, goal = 0, DOMNodeCache = [];

  function load(url, version) {
    function clearLocalStorage() {
      var i = 0;
      do {
        var key = localStorage.key(i++);
        var content = localStorage.getItem(key);
        if (preserves.indexOf(key) === -1) localStorage.removeItem(key);
      } while (content);
    }

    function appendNode(type, content, position) {
      var node = document.createElement(type);
      node.appendChild(document.createTextNode(content));
      DOMNodeCache[position] = node;
      while(DOMNodeCache[progress]) {
        document.head.appendChild(DOMNodeCache[progress++]);
      }
    }

    var type = url.split('.').pop() === 'js' ? 'script' : 'style';
    var index = goal++;
    var contentKey = 'assets(' + url + ').content';
    var versionKey = 'assets(' + url + ').version';
    var content = localStorage.getItem(contentKey);
    var localVersion = localStorage.getItem(versionKey);
    preserves.push(versionKey);
    preserves.push(contentKey);
    if (version === localVersion && content) {
      window.setTimeout(function() {
        appendNode(type, content, index);
      }, 0);
    } else {
      var request = new XMLHttpRequest();
      request.onload = function(/* event */) {
        var content = request.responseText;
        appendNode(type, content, index);
        try {
          localStorage.setItem(contentKey, content);
          localStorage.setItem(versionKey, version);
        } catch(err) {
          clearLocalStorage();
          localStorage.setItem(contentKey, content);
          localStorage.setItem(versionKey, version);
        }
      };
      request.open('get', url);
      request.send();
    }
  };

  // load('script|style', 'path/to/source', 'filename@@version');
  load('/assets/app.css', 'app.css@@version');
  load('/assets/vendor.js', 'vendor.js@@version');
  load('/assets/app.js', 'app.js@@version');
})();
