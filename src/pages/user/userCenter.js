import angular from 'angular'

export default angular.module('onepiece')
  .controller('UserCenterController',
    ($scope, $http, user, popper) => {
      $scope.user = user
      $scope.popper = popper

      $scope.keyLogIn = (e) => {
        if (e.keyCode === 13) $scope.logIn()
      }

      $scope.logIn = user.loginWithPassword
      $scope.logOut = user.logOut
    })
