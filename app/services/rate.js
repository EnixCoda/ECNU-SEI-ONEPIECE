angular.module('onepiece')
  .factory('rate',
    function ($http, toast, user) {
      var rateManager = {};
      rateManager.file = {};
      rateManager.set = function (file) {
        rateManager.gettingRate = false;
        rateManager.file = file;
        rateManager.key = rateManager.file.id;
      };
      rateManager.get = function () {
        rateManager.file.gettingRate = true;
        $http.get(['file', rateManager.file.id, 'score'].join('/'))
          .then(function (response) {
            rateManager.file.gettingRate = false;
            var responseData = response.data;
            if (responseData['res_code'] === 0) {
              rateManager.file.totalScore = responseData['data']['total_score'];
              rateManager.file.score = rateManager.file.totalScore;
            } else {
              rateManager.file.gettingRate = false;
              toast.show(responseData['msg'], '', 'error');
            }
          }, function () {
            rateManager.file.gettingRate = false;
            toast.show('无法获取评分', '', 'error');
          });
      };
      rateManager.send = function (score) {
        toast.show('正在提交评分', '', 'success');
        $http.post(['file', rateManager.file.id, 'score'].join('/'), {
          score: score,
          token: user.token
        })
          .then(function (response) {
            var responseData = response.data;
            if (responseData['res_code'] === 0) {
            } else {
              toast.show(responseData['msg'], '', 'error');
            }
            rateManager.get();
          }, function () {
            toast.show('无法连接到服务器', '', 'error');
          });
      };

      return rateManager;
    });
