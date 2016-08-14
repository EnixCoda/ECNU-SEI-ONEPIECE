angular.module('onepiece')
.factory('comment', function ($http, toast, user) {
  'use strict';
  var commentManager = {};
  commentManager.set = function (type, key) {
    commentManager.gettingComment = false;
    commentManager.type = type;
    commentManager.key = key;
  };
  commentManager.get = function () {
    commentManager.gettingComment = true;
    $http.get([commentManager.type, commentManager.key, 'comment'].join('/'))
      .then(function (response) {
        commentManager.gettingComment = false;
        var responseData = response.data;
        if (responseData['res_code'] === 0) {
          commentManager.comments = responseData['data']['comments'];
        } else {
          commentManager.comments = [];
          toast.show(responseData['msg'], '', 'error');
        }
      }, function () {
        commentManager.gettingComment = false;
        commentManager.comments = [];
        toast.show('无法获取评论', '', 'error');
      });
  };
  commentManager.send = function () {
    toast.show('正在提交评论', '', 'success');
    $http
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
          toast.show(responseData['msg'], '', 'error');
        }
      }, function () {
        toast.show('无法连接到服务器', '', 'error');
      });
  };
  commentManager.remove = function (commentId) {
    toast.show('正在删除', '', 'success');
    $http.delete([commentManager.type, commentManager.key, 'comment'].join('/'), {
      id: commentId,
      token: user.token
    })
      .then(function (response) {
        var responseData = response.data;
        if (responseData['res_code'] === 0) {
          commentManager.get();
          toast.show(responseData['msg'], '', 'success');
        } else {
          toast.show(responseData['msg'], '', 'error');
        }
      }, function () {
        toast.show('无法连接到服务器', '', 'error');
      });
  };

  return commentManager;
});