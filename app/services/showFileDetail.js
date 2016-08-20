angular.module('onepiece')
  .factory('showFileDetail',
    function ($mdDialog, $mdMedia) {
      'use strict';
      return function (file, e) { $mdDialog.show({
          controller: 'FilePreviewController',
          templateUrl: 'file_preview.html',
          targetEvent: e,
          locals: {
            file: file
          },
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: true
        });
      };
    });