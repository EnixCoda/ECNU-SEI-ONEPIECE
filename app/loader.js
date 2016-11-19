(function () {
  // load('script|style', 'path/to/source', 'filename@@version');
  load('script', '/assets/app.js', 'app.js@@version');
  load('style', '/assets/app.css', 'app.css@@version');

  function load(type, url, version) {
    var localVersion = localStorage.getItem('assets.version.' + url);
    var item = localStorage.getItem('assets.' + url);
    if (version === localVersion && item) {
      appendNode(type, item);
    } else {
      var request = new XMLHttpRequest();
      request.onreadystatechange = function (/* event */) {
        if (request.readyState === 4) {
          var content = request.responseText;
          appendNode(type, content);
          localStorage.setItem('assets.' + url, content);
          localStorage.setItem('assets.version.' + url, version);
        }
      };
      request.open('get', url);
      request.send();
    }
  }

  function appendNode(type, content) {
    var node = document.createElement(type);
    node.appendChild(document.createTextNode(content));
    document.head.appendChild(node);
  }
})();