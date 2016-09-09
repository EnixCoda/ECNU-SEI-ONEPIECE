angular.module('onepiece')
  .controller('UploadController',
    function ($scope, $mdDialog, $http, indexLoader, user, explorer, toast, popper, SJAX) {
      $scope.user = user;
      $scope.explorer = explorer;
      $scope.indexLoader = indexLoader;

      $scope.namingDirKeyPress = function (e) {
        if (e.keyCode === 13 && $scope.explorer.newDirName) {
          $scope.explorer.saveDir($scope.explorer.newDirName);
        }
      };

      $scope.doneFiles = [];
      $scope.uploadingCount = 0;

      $scope.startUpload = function () {
        if ($scope.explorer.path.length < 3) {
          toast.show('无法上传到当前位置。请选择课程分类、课程名称。', 'warning');
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

      $scope.close = $mdDialog.hide;


      $scope.QUploaderConfig = {
        runtimes: 'html5',
        browse_button: 'pickfiles',
        // uptoken_url: 'uploadToken',
        uptoken_func: function (file) {
          return SJAX.run('GET', 'uploadToken', {
            token: user.token,
            key: explorer.path.slice(1).map(function (cur) {
              return cur.name;
            }).concat([file.name]).join('/')
          }, function (responseText) {
            var res = JSON.parse(responseText);
            if (res['res_code'] === 0) {
              file.validToken = true;
              return res['data']['uptoken'];
            } else {
              toast.show(file.name + ' 上传失败：' + res['msg'], 'error', true);
              return '';
            }
          }, function () {
            toast.show('服务器错误', 'error', true);
            return '';
          }, function () {
            toast.show('无法连接到服务器', 'error', true);
            return '';
          });
        },
        get_new_uptoken: true,
        domain: '7xt1vj.com1.z0.glb.clouddn.com',
        max_file_size: '100mb',
        max_retries: 1,
        chunk_size: '4mb',
        dragdrop: true,
        // auto_start: true,
        init: {
          FilesAdded: function (up, files) {
            plupload.each(files, function (file) {

            });
            $scope.$apply();
          },
          BeforeUpload: function (/*up, file*/) {
            $scope.uploadingCount++;
          },
          UploadProgress: function (/*up, file*/) {
            if (!$scope.canceling) $scope.$apply();
            else $scope.canceling = false;
          },
          FileUploaded: function (up, file, info) {
            info = JSON.parse(info);
            var data = {
              token: user.token,
              fileId: info['etag'],
              filePath: info['key']
            };
            $http.post('uploaded', data);
            up.removeFile(file);
            file.success = true;
            $scope.doneFiles.push(file);
            $scope.uploadingCount--;
            $scope.indexLoader.load();
            $scope.$apply();
          },
          Error: function (up, err, errTip) {
            if (err.file.validToken) {
              toast.show('上传失败! ' + err.file.name + ': ' + errTip, 'error', true);
            }
            up.removeFile(err.file);
            $scope.doneFiles.push(err.file);
            $scope.uploadingCount--;
            $scope.$apply();
          },
          UploadComplete: function () {
          },
          Key: function (up, file) {
            return explorer.path.slice(1).map(
              function (cur) {
                return cur.name;
              }
            ).concat([file.name]).join('/');
          }
        }
      };
    });
