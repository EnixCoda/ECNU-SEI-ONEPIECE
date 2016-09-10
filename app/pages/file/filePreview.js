angular.module('onepiece')
  .controller('FilePreviewController',
    function ($scope, $mdDialog, $http, file, user, comment, explorer, rate, utility, downloader) {
      $scope.file = file;
      $scope.user = user;
      $scope.explorer = explorer;
      $scope.formatFileSize = utility.formatFileSize;
      $scope.previewable = utility.previewable;
      $scope.downloadFile = downloader.downloadFile;
      $scope.previewFile = downloader.previewFile;

      rate.set(file);
      rate.get();
      comment.set('file', file);
      comment.get();

      $scope.getShareLink = function () {
        var copySucceeded;
        if (!copySucceeded) window.prompt("自动复制失败了,请手动复制一下~", explorer.getShareLink());
      };

      $scope.cancel = function () {
        $mdDialog.cancel();
      }
    })
;
