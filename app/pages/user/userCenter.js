angular.module('onepiece')
  .controller('UserCenterController',
    function ($scope, $mdDialog, $http, user) {
      $scope.user = user;

      $scope.keyLogIn = function (e) {
        if (e.keyCode === 13) $scope.logIn();
      };

      $scope.logIn = user.loginWithPassword;
      $scope.logOut = user.logOut;

      $scope.close = $mdDialog.hide;
    });
