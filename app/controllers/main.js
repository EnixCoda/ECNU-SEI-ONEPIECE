angular.module('onepiece')
  .controller('MainController',
    ($scope, explorer, user, indexLoader) => {
      $scope.indexLoader = indexLoader
      indexLoader.load()
      user.loginWithToken()
    })
