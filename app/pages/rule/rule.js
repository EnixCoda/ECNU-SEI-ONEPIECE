angular.module('onepiece')
  .controller('RuleController',
    function ($scope, $mdBottomSheet) {
      $scope.close = $mdBottomSheet.hide;
    });
