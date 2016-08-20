angular.module('onepiece')
  .controller('FilePreviewController',
    function ($scope, $mdDialog, $http, file, user, comment, rate, utility, downloader) {
      $scope.file = file;
      $scope.user = user;
      $scope.formatFileSize = utility.formatFileSize;
      $scope.previewable = utility.previewable;
      $scope.downloadFile = downloader.downloadFile;
      $scope.previewFile = downloader.previewFile;

      rate.set(file);
      rate.get();
      comment.set('file', file);
      comment.get();

      $scope.cancel = $mdDialog.cancel;
    });
