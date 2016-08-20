angular.module('onepiece')
  .controller('MainController',
    function ($scope, explorer, user, utility, indexLoader) {
      $scope.explorer = explorer;
      
      indexLoader.load();
      user.loginWithToken();

      void function () {
        $scope.isNanoScreen = Math.min(utility.getWindowSize().width, utility.getWindowSize().height) < 340;
        if ($scope.isNanoScreen) {
          alert('检测到当前窗口尺寸较小，已为您隐藏返回按钮。想要返回上级目录请点击上方路径中的文件夹名。');
        }
      } ();
    });
