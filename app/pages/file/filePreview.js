angular.module('onepiece')
  .controller('FilePreviewController',
    function ($scope, $http, file, user, comment, explorer, rate, utility, downloader, popper) {
      $scope.file = file;
      $scope.user = user;
      $scope.explorer = explorer;
      $scope.popper = popper;
      $scope.formatFileSize = utility.formatFileSize;
      $scope.previewable = utility.previewable;
      $scope.downloadFile = downloader.downloadFile;
      $scope.previewFile = downloader.previewFile;

      rate.set(file);
      rate.get();
      comment.set('file', file);
      comment.get();
    })
;
