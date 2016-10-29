var version = '1.0.0';

load('script', '/assets/app.js');
load('style', '/assets/app.css');

function load(type, url) {
  var localVersion = localStorage.getItem('assets.version');
  var item = localStorage.getItem('assets.' + type);
  if (version === localVersion && item) {
    appendNode(type, item);
  } else {
    localStorage.removeItem('assets.' + type);
    localStorage.removeItem('assets.version');
    var request = new XMLHttpRequest();
    request.onreadystatechange = function (event) {
      if (request.status === 200 && request.readyState === 4) {
        var content = request.responseText;
        appendNode(type, content);
        localStorage.setItem('assets.' + type, content);
        localStorage.setItem('assets.version', version);
      }
    };
    request.onprogress = function (event) {
      drawLoadProgress(type, event.loaded, event.total);
    };
    request.open('get', url);
    request.send();
  }
}

function drawLoadProgress(type, loaded, total) {
  var loaderProgress = document.querySelector('#loader-progress');
  progress = loaded / total;
  width = progress * 100 + '%';
  if (type === 'script') {
    loaderProgress.style.width = width;
    if (loaded === total) setTimeout(function () {
      loaderProgress.style.display = 'none';
    }, 200);
  }
}

function appendNode(type, content) {
  var head = document.head;
  var node = document.createElement(type);
  node.appendChild(document.createTextNode(content));
  head.appendChild(node);
}
