angular.module('onepiece')
  .controller('UserCenterController',
    function ($scope, $http, user, popper) {
      $scope.user = user;
      $scope.popper = popper;

      $scope.keyLogIn = function (e) {
        if (e.keyCode === 13) $scope.logIn();
      };

      $scope.logIn = user.loginWithPassword;
      $scope.logOut = user.logOut;
    });
