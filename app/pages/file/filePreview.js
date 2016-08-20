/**
 * Created by exincoda on 16/8/13.
 */

angular.module('onepiece')
  .controller('FilePreviewController',
    function ($scope, $mdDialog, $http, file, user, comment, utility, downloader, showUserCenter) {
      $scope.toastBound = 'filePreviewToastBounds';

      $scope.file = file;
      $scope.user = user;
      $scope.showUserCenter = showUserCenter;
      $scope.formatFileSize = utility.formatFileSize;

      // rate.get();
      comment.set('file', file);
      comment.get();

      $scope.downloadFile = function (file) {
        downloader.downloadFile(file, $scope.toastBound);
      };

      $scope.previewFile = function (file) {
        downloader.previewFile(file, $scope.toastBound);
      };

      $scope.previewable = utility.previewable;

      // $scope.rateFile = rate.send;

      $scope.cancel = $mdDialog.cancel;
    });