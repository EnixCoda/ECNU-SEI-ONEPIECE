/**
 * Created by exincoda on 16/8/13.
 */

angular.module('onepiece')
  .factory('rate',
    function ($http) {
      'use strict';
      var rateManager = {};
      rateManager.file = file;
      rateManager.get = function () {
        file.gettingRate = true;
        $http.get(['file', rateManager.file.id, 'score'].join('/'))
          .then(function (response) {
            file.gettingRate = false;
            var responseData = response.data;
            if (responseData['res_code'] === 0) {
              file.totalScore = responseData['data']['total_score'];
              rateManager.file.score = file.totalScore;
            } else {
              // toast.show(responseData['msg'], $scope.toastBound, 'error');
            }
          }, function () {
            file.gettingRate = false;
            // toast.show('无法获取评分', $scope.toastBound, 'error');
          });
      };
      rateManager.send = function (score) {
        // toast.show('正在提交评分', $scope.toastBound, 'success');
        $http.post(['file', rateManager.file.id, 'score'].join('/'), {
          score: score,
          token: user.token
        })
          .then(function (response) {
            var responseData = response.data;
            if (responseData['res_code'] === 0) {
            } else {
              // toast.show(responseData['msg'], $scope.toastBound, 'error');
            }
            rateManager.get();
          }, function () {
            // toast.show('无法连接到服务器', $scope.toastBound, 'error');
          });
      };

      return rateManager;
    });