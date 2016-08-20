angular.module('onepiece')
  .factory('SJAX', function () {
    var sjax = {};
    sjax.run = function (method, url, data, success, fail, error) {
      var xmlHttp = {};
      if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
      } else {
        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
      }
      var postfix = '';
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          postfix += key + '=' + encodeURI(data[key]);
        }
      }
      postfix = postfix ? '?' + postfix : postfix;
      xmlHttp.open(method, url + postfix, false);
      xmlHttp.setRequestHeader('If-Modified-Since', '0');
      try {
        xmlHttp.send();
        if (xmlHttp.status === 200) {
          return success(xmlHttp.responseText);
        } else {
          return fail();
        }
      } catch (err) {
        return error();
      }
    };
    return sjax;
  });
