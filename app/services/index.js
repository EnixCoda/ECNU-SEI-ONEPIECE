angular.module('onepiece')
  .factory('indexLoader',
    function ($http, lessonLoader, toast, explorer) {
      var indexLoader = {
        index: []
      };
      indexLoader.loadingIndex = true;
      indexLoader.load = function () {
        $http.get('index')
          .then(function (response) {
            var responseData = response.data;
            if (responseData['res_code'] === 0) {
              indexLoader.loading = false;
              indexLoader.index = responseData['data']['index'];
              lessonLoader.parse(indexLoader.index);
              explorer.setPath([indexLoader.index]);
            } else {
              indexLoader.failed = true;
              toast.show('加载文件列表失败，请刷新重试。', '', 'error');
            }
          }, function () {
            indexLoader.failed = true;
            toast.show('加载文件列表失败，请刷新重试。', '', 'error');
          });
      };
      indexLoader.load();

      return indexLoader;
  });