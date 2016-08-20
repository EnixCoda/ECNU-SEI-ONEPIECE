angular.module('onepiece')
  .factory('user',
    function ($http, $mdDialog, $timeout, cookie, toast) {
      var user = {
        cademy: null,
        id: null,
        name: null,
        token: cookie.loadTokenFromCookie()
      };
      user.statuses = ['OFFLINE', 'CONNECTING', 'ONLINE'];
      user.status = user.statuses[0];
      user.logout = function () {
        user.status = user.statuses[0];
        cookie.clearTokenFromCookie();
        toast.show('您已登出', '', 'success');
      };
      user.login = function (data) {
        user.status = user.statuses[1];
        $http.post('login', data)
          .then(function (response) {
            var responseData = response.data;
            if (responseData['res_code'] === 0) {
              var userData = responseData['data'];
              user.token = userData['token'];
              user.name = userData['username'];
              user.cademy = userData['cademy'];
              user.status = user.statuses[2];
              cookie.saveTokenToCookie(user.token);
              toast.show(responseData['msg'], '', 'success', true, 'top left');
              $timeout($mdDialog.hide, 2000);
            } else {
              user.status = user.statuses[0];
              toast.show(responseData['msg'], '', 'error', true);
            }
          }, function () {
            user.status = user.statuses[0];
            toast.show('无法连接到服务器', '', 'error');
          });
      };
      user.loginWithPassword = function () {
        if (!user.id || !user.password) return;
        var data = {
          id: user.id,
          password: user.password
        };
        user.login(data);
      };
      user.loginWithToken = function () {
        if (!user.token) return;
        var data = {
          token: user.token
        };
        user.login(data);
      };
      user.onFinish = function () {
      };

      user.loginWithToken();

      return user;
    });
