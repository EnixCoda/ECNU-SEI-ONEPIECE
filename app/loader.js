(function () {
  var preserves = ['notFirstTime'];
  var count = 0, total = 0, deferredNodes = [];

  function load(type, url, version) {
    function clearLocalStorage() {
      var i = 0;
      do {
        var key = localStorage.key(i++);
        var content = localStorage.getItem(key);
        if (preserves.indexOf(key) === -1) localStorage.removeItem(key);
      } while (content);
    };

    function appendNode(type, content, position) {
      var node = document.createElement(type);
      node.appendChild(document.createTextNode(content));
      deferredNodes[position] = node;
      if (++count < total) return;
      count = 0;
      while(count < total) {
        document.head.appendChild(deferredNodes[count++]);
      }
    };

    var __i = total++;
    var versionKey = 'assets(' + url + ').version';
    var contentKey = 'assets(' + url + ').content';
    preserves.push(versionKey);
    preserves.push(contentKey);
    var localVersion = localStorage.getItem(versionKey);
    var content = localStorage.getItem(contentKey);
    if (version === localVersion && content) {
      window.setTimeout(function() {
        appendNode(type, content, __i);
      }, 0);
    } else {
      var request = new XMLHttpRequest();
      request.onload = function(/* event */) {
        var content = request.responseText;
        appendNode(type, content, __i);
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
  load('style', '/assets/app.css', 'app.css@@version');
  load('script', '/assets/vendor.js', 'vendor.js@@version');
  load('script', '/assets/app.js', 'app.js@@version');
})();