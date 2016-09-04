angular.module('onepiece')
  .factory('rate',
    function ($resource, toast, user) {
      var Rate = $resource('/:type/:key/score', {}, {});

      var rateManager = {};
      rateManager.file = {};
      rateManager.set = function (file) {
        rateManager.gettingRate = false;
        rateManager.file = file;
        rateManager.key = rateManager.file.id;
      };
      rateManager.get = function () {
        rateManager.file.gettingRate = true;
        Rate.get({
            type: 'file',
            key: rateManager.file.id
          },
          function (response) {
            rateManager.file.gettingRate = false;
            if (response['res_code'] === 0) {
              rateManager.file.totalScore = response['data']['total_score'];
              rateManager.file.score = rateManager.file.totalScore;
            } else {
              rateManager.file.gettingRate = false;
              toast.show(response['msg'], 'error');
            }
          },
          function () {
            rateManager.file.gettingRate = false;
            toast.show('无法获取评分', 'error');
          });
      };
      rateManager.send = function (score) {
        toast.show('正在提交评分', 'success');
        Rate.save({
            type: 'file',
            key: rateManager.file.id
          }, {
            score: score,
            token: user.token
          },
          function (response) {
            if (response['res_code'] === 0) {
            } else {
              toast.show(response['msg'], 'error');
            }
            rateManager.get();
          },
          function () {
            toast.show('无法连接到服务器', 'error');
          });
      };

      return rateManager;
    });
