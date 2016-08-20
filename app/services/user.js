/**
 * Created by exincoda on 16/8/13.
 */

angular.module('onepiece')
  .factory('user',
    function ($http, cookie, toast) {
      'use strict';
      var statuses = ['OFFLINE', 'CONNECTING', 'ONLINE'];
      var user = {
        id: null,
        token: cookie.loadTokenFromCookie(),
        cademy: null,
        name: null
      };
      user.statuses = statuses;
      user.status = statuses[0];
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
              user.token = responseData['data']['token'];
              user.name = responseData['data']['username'];
              user.cademy = responseData['data']['cademy'];
              user.status = user.statuses[2];
              cookie.saveTokenToCookie(user.token);
              toast.show(responseData['msg'], '', 'success', true, 'top left');
              setTimeout(user.complete, 2000);
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