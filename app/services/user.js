angular.module('onepiece')
  .factory('user',
    function ($http, $timeout, cookie, toast, popper) {
      var user = {
        cademy: null,
        id: null,
        name: null,
        anonymous: false
      };
      user.statuses = ['OFFLINE', 'CONNECTING', 'ONLINE'];
      user.status = user.statuses[0];
      user.logOut = () => {
        user.status = user.statuses[0];
        user.cademy = null;
        user.id = null;
        user.name = null;
        cookie.clearTokenFromCookie();
        toast.show('您已登出');
      };
      user.login = data => {
        user.status = user.statuses[1];
        $http.post('login', data)
          .then(response => {
            var responseData = response.data;
            if (responseData['res_code'] === 0) {
              var userData = responseData['data'];
              user.status = user.statuses[2];
              user.name = userData['username'];
              user.cademy = userData['cademy'];
              cookie.saveTokenToCookie(userData['token']);
              toast.show(responseData['msg'], 'success', true, 'top left');
              popper.hide('user center');
            } else {
              user.status = user.statuses[0];
              toast.show(responseData['msg'], 'error', true);
            }
          }, () => {
            user.status = user.statuses[0];
            toast.show('无法连接到服务器', 'error');
          });
      };
      user.loginWithPassword = () => {
        if (!user.id || !user.password) return;
        var data = {
          id: user.id,
          password: user.password
        };
        user.login(data);
      };
      user.loginWithToken = () => {
        var token = cookie.loadTokenFromCookie();
        if (token) {
          user.login();
        }
      };

      return user;
    });
