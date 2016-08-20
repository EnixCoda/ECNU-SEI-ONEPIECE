/**
 * Created by exincoda on 16/8/13.
 */

angular.module('onepiece')
  .controller('RuleController',
    function ($scope, $mdDialog) {
      $scope.close = function () {
        $mdDialog.hide();
      };
      // TODO
    });
