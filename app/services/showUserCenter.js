/**
 * Created by exincoda on 16/8/13.
 */

angular.module('onepiece')
  .factory('showUserCenter',
    function ($mdDialog, $mdMedia) {
      'use strict';
      return function (e) {
        $mdDialog.show({
          controller: 'UserCenterController',
          templateUrl: 'user_center.html',
          targetEvent: e,
          locals: {},
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: true
        });
      }
    });