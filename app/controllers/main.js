angular.module('onepiece')
  .controller('MainController',
    function ($scope, explorer, user, utility, indexLoader) {
      $scope.explorer = explorer;
      
      indexLoader.load();
      user.loginWithToken();
    });
