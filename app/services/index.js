angular.module('onepiece')
  .factory('indexLoader',
    function ($http, $timeout, lessonLoader, explorer) {
      function success (data) {
        indexLoader.index = data;
        lessonLoader.parse(indexLoader.index);
        explorer.setIndex(indexLoader.index);
        $timeout(function () {
          indexLoader.status = indexLoader.statuses[1];
        }, 400);
      }

      function fail () {
        indexLoader.status = indexLoader.statuses[2];
      }

      // TODO: cache with localStorage and timestamp
      var indexLoader = {};
      indexLoader.statuses = ['LOADING', 'SUCCESS', 'FAILED'];
      indexLoader.index = [];
      indexLoader.status = indexLoader.statuses[0];
      indexLoader.load = function () {
        $http.get('index')
          .then(function (response) {
            var responseData = response.data;
            if (responseData['res_code'] === 0) {
              success(responseData['data']['index']);
            } else {
              fail();
            }
          }, function () {
            fail();
          });
      };

      return indexLoader;
  });
