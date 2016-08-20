angular.module('onepiece')
  .factory('cookie',
    function () {
      var CookieManager = {
        saveTokenToCookie: function (token) {
          var OneMonthLater = new Date();
          OneMonthLater.setDate(OneMonthLater.getDate() + 30);
          var expire_s = OneMonthLater.toUTCString();
          CookieManager.setCookie('token', token, expire_s);
        },
        loadTokenFromCookie: function () {
          var cookie_s = document.cookie;
          var cookies = cookie_s.split('; ');
          for (var i = 0; i < cookies.length; i++) {
            if (cookies[i].indexOf('=') > -1) {
              var pair = cookies[i].split('=');
              var key = pair[0], value = pair[1];
              if (!key || !value) continue;
              if (key === 'token') {
                return value;
              }
            }
          }
          return null;
        },
        clearTokenFromCookie: function () {
          var OneMonthAgo = new Date();
          OneMonthAgo.setMonth(OneMonthAgo.getMonth() - 1);
          var expire_s = OneMonthAgo.toUTCString();
          CookieManager.setCookie('token', '', expire_s);
        },
        setCookie: function (key, value, expires) {
          document.cookie = key + '=' + value + ';path=;expires=' + expires;
        }
      };

      return CookieManager;
    });
