angular.module('onepiece')
  .factory('indexLoader',
    function ($http, lessonLoader, explorer) {
      function success (data) {
        indexLoader.index = data;
        lessonLoader.parse(indexLoader.index);
        explorer.setIndex(indexLoader.index);
        indexLoader.loading = false;
      }

      function fail () {
        indexLoader.loading = false;
        indexLoader.failed = true;
      }

      // TODO: status controller

      // TODO: cache with localStorage and timestamp
      var indexLoader = {};
      indexLoader.index = [];
      indexLoader.loading = true;
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
