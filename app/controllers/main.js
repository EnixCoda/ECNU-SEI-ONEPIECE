angular.module('onepiece')
  .controller('MainController',
    function ($scope, explorer, user, indexLoader) {
      $scope.indexLoader = indexLoader;
      indexLoader.load();
      user.loginWithToken();
    });
