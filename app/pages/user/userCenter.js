/**
 * Created by exincoda on 16/8/13.
 */

angular.module('onepiece')
  .controller('UserCenterController',
    function ($scope, $mdDialog, $http, user) {
      $scope.toastBound = 'userCenterToastBounds';
      $scope.user = user;

      $scope.keyLogIn = function (e) {
        if (e.keyCode === 13) $scope.logIn();
      };

      $scope.logIn = function () {
        user.loginWithPassword($scope, user);
      };

      $scope.logOut = function () {
        user.logout();
      };

      $scope.close = function () {
        $mdDialog.hide();
      };

      user.onFinish($scope.close);
    });
