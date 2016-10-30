var version = '1.0.2';

load('script', '/assets/app.js');
load('style', '/assets/app.css');

function load(type, url) {
  var localVersion = localStorage.getItem('assets.version');
  var item = localStorage.getItem('assets.' + type);
  if (version === localVersion && item) {
    appendNode(type, item);
  } else {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function (event) {
      if (request.readyState === 4) {
        console.log('in');
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
  var head = document.head;
  var node = document.createElement(type);
  node.appendChild(document.createTextNode(content));
  head.appendChild(node);
}
