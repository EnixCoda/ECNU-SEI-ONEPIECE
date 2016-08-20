angular.module('onepiece')
  .factory('indexLoader',
    function ($http, lessonLoader, toast, explorer) {
      function success () {
        indexLoader.loading = false;
        lessonLoader.parse(indexLoader.index);
        explorer.setPath([indexLoader.index]);
      }
      
      function fail () {
        indexLoader.failed = true;
        toast.show('加载文件列表失败，请刷新重试。', '', 'error');
      }

      var indexLoader = {}
      indexLoader.index = [];
      indexLoader.loadingIndex = true;
      indexLoader.load = function () {
        $http.get('index')
          .then(function (response) {
            var responseData = response.data;
            if (responseData['res_code'] === 0) {
              indexLoader.index = responseData['data']['index'];
              success();
            } else {
              fail();
            }
          }, function () {
            fail();
          });
      };
      indexLoader.load();

      return indexLoader;
  });