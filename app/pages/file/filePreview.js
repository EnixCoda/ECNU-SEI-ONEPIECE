angular.module('onepiece')
  .controller('FilePreviewController',
    function ($scope, file, user, comment, explorer, rate, utility, downloader, popper) {
      $scope.file = file;
      $scope.user = user;
      $scope.explorer = explorer;
      $scope.popper = popper;
      $scope.formatFileSize = utility.formatFileSize;
      $scope.previewable = utility.previewable;
      $scope.downloadFile = downloader.downloadFile;
      $scope.previewFile = ($event) => {
        popper.showPreviewPanel($event, file);
      };

      rate.set(file);
      rate.get();
      comment.set('file', file);
      comment.get();
    });
