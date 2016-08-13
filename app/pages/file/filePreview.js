/**
 * Created by exincoda on 16/8/13.
 */

angular.module('onepiece')
  .controller('FilePreviewController',
    function ($scope, $mdDialog, $http, file, user, showUserCenter) {
      $scope.toastBound = 'filePreviewToastBounds';

      $scope.file = file;
      $scope.user = user;
      $scope.showUserCenter = showUserCenter;
      $scope.formatFileSize = Utility.formatFileSize;

      var commentManager = CommentManager.new($scope, $http, 'file', file.id);

      commentManager.get();

      var rateManager = RateManager.new($scope, $http, file);

      rateManager.get();

      $scope.downloadFile = function (file) {
        Downloader.downloadFile(file, $scope.toastBound);
      };

      $scope.previewFile = function (file) {
        Downloader.previewFile(file, $scope.toastBound);
      };

      $scope.previewable = Utility.previewable;

      $scope.rateFile = rateManager.send;

      $scope.sendComment = function () {
        if ($scope.comment) {
          commentManager.send();
        }
      };

      $scope.cancel = $mdDialog.cancel;
    });