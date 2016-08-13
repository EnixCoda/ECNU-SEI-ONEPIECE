/**
 * Created by exincoda on 16/8/13.
 */

angular.module('onepiece')
  .factory('comment',
    function ($http, user) {
      'use strict';
      var commentManager = {};
      commentManager.type = type;
      commentManager.key = key;
      commentManager.gettingComment = false;

      commentManager.get = function () {
        commentManager.gettingComment = true;
        $http.get([commentManager.type, commentManager.key, 'comment'].join('/'))
          .then(function (response) {
            commentManager.gettingComment = false;
            var responseData = response.data;
            if (responseData['res_code'] === 0) {
              commentManager.comments = responseData['data']['comments'];
            } else {
              // toast.show(responseData['msg'], $scope.toastBound, 'error');
            }
          }, function () {
            commentManager.gettingComment = false;
            // toast.show('无法获取评论', $scope.toastBound, 'error');
          });
      };
      commentManager.send = function () {
        // toast.show('正在提交评论', $scope.toastBound, 'success');
        commentManager
          .$http
          .post([commentManager.type, commentManager.key, 'comment'].join('/'), {
            username: user.anonymous ? '匿名' : user.username ? user.username : user.name,
            comment: commentManager.comment,
            token: user.token
          })
          .then(function (response) {
            var responseData = response.data;
            if (responseData['res_code'] === 0) {
              commentManager.get();
            } else {
              // toast.show(responseData['msg'], $scope.toastBound, 'error');
            }
          }, function () {
            // toast.show('无法连接到服务器', $scope.toastBound, 'error');
          });
      };
      commentManager.remove = function (commentId) {
        // toast.show('正在删除', $scope.toastBound, 'success');
        $http.delete([commentManager.type, commentManager.key, 'comment'].join('/'), {
          id: commentId,
          token: user.token
        })
          .then(function (response) {
            var responseData = response.data;
            if (responseData['res_code'] === 0) {
              commentManager.get();
              // toast.show(responseData['msg'], $scope.toastBound, 'success');
            } else {
              // toast.show(responseData['msg'], $scope.toastBound, 'error');
            }
          }, function () {
            // toast.show('无法连接到服务器', $scope.toastBound, 'error');
          });
      };

      return commentManager;
    });