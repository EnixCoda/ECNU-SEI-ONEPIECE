(function () {
  var debug = false;
  var version = '1.0.10';

  load('script', '/assets/app.js');
  load('style', '/assets/app.css');

  function load(type, url) {
    var localVersion = localStorage.getItem('assets.version');
    var item = localStorage.getItem('assets.' + type);
    if (version === localVersion && item && !debug) {
      appendNode(type, item);
    } else {
      var request = new XMLHttpRequest();
      request.onreadystatechange = function (/* event */) {
        if (request.readyState === 4) {
          var content = request.responseText;
          appendNode(type, content);
          localStorage.setItem('assets.' + type, content);
          localStorage.setItem('assets.version', version);
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