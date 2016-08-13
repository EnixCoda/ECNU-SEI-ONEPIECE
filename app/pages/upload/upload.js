/**
 * Created by exincoda on 16/8/13.
 */

angular.module('onepiece')
  .controller('UploadController',
    function ($scope, $mdDialog, showUserCenter, user, path) {
      $scope.toastBound = 'uploadControllerToastBounds';

      $scope.showUserCenter = showUserCenter;
      $scope.user = user;
      $scope.path = path;

      $scope.explorer = Explorer.new(path);

      $scope.namingDirKeyPress = function (e) {
        if (e.keyCode == 13 && $scope.explorer.newDirName) {
          $scope.explorer.saveDir($scope.explorer.newDirName);
        }
      };

      $scope.doneFiles = [];
      $scope.uploadingCount = 0;

      $scope.startUpload = function () {
        if ($scope.explorer.path.length < 3) {
          toast.show('无法上传到当前位置。请选择课程分类、课程名称。', $scope.toastBound, 'warning');
        } else {
          $scope.QUploader.start();
        }
      };

      $scope.cancel = function (file) {
        $scope.uploadingCount--;
        $scope.canceling = true;
        $scope.QUploader.removeFile(file);
        $scope.doneFiles.push(file);
      };

      $scope.close = function () {
        $mdDialog.hide();
      };
    });
