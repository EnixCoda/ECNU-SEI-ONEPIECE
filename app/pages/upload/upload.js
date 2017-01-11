angular.module('onepiece')
  .controller('UploadController',
    ($scope,  $http, uploadManager, indexLoader, user, explorer, toast, popper, SJAX) => {
      $scope.user = user
      $scope.explorer = explorer
      $scope.indexLoader = indexLoader
      $scope.uploadManager = uploadManager
      $scope.popper = popper

      $scope.checkPath = (e) => {
        if (explorer.path.length < 3) {
          e.stopPropagation()
          e.preventDefault()
          toast.show('无法上传到当前位置。请选择课程分类、课程名称。', 'warning')
        }
      }

      $scope.startUpload = () => {
        $scope.QUploader.start()
      }

      $scope.cancel = (file) => {
        uploadManager.uploadingCount--
        $scope.canceling = true
        $scope.QUploader.removeFile(file)
        if (file.uploadStarted) uploadManager.doneFiles.push(file)
      }

      // TODO: scope chain is messy
      $scope.QUploaderConfig = {
        runtimes: 'html5',
        browse_button: 'pickfiles',
        // uptoken_url: 'uploadToken',
        uptoken_func(file) {
          return SJAX.run('GET', 'uploadToken', {
            key: file.key
          }, (responseText) => {
            const res = JSON.parse(responseText)
            if (res['res_code'] === 0) {
              file.validToken = true
              return res['data']['uptoken']
            } else {
              toast.show(file.name + ' 上传失败：' + res['msg'], 'error', true)
              return ''
            }
          }, () => {
            toast.show('服务器错误', 'error', true)
            return ''
          }, () => {
            toast.show('无法连接到服务器', 'error', true)
            return ''
          })
        },
        get_new_uptoken: true,
        domain: '7xt1vj.com1.z0.glb.clouddn.com',
        max_file_size: '200mb',
        max_retries: 1,
        chunk_size: `4mb`,
        dragdrop: true,
        // auto_start: true,
        init: {
          FilesAdded(up, files) {
            plupload.each(files, (file) => {
              file.key = explorer.path.slice(1).map(
                  (cur) => {
                    return cur.name
                  }
                ).concat([file.name]).join('/')
            })
            $scope.$apply()
          },
          BeforeUpload(up, file) {
            uploadManager.uploadingCount++
            file.uploadStarted = true
          },
          UploadProgress(/*up, file*/) {
            if (!$scope.canceling) $scope.$apply()
            else $scope.canceling = false
          },
          FileUploaded(up, file, info) {
            info = JSON.parse(info)
            const data = {
              fileId: info['etag'],
              filePath: info['key']
            }
            $http.post('uploaded', data)
                .then(() => indexLoader.load())
            up.removeFile(file)
            file.success = true
            uploadManager.doneFiles.push(file)
            uploadManager.uploadingCount--
            $scope.$apply()
          },
          Error(up, err, errTip) {
            if (err.file.validToken) {
              toast.show('上传失败! ' + err.file.name + ': ' + errTip, 'error', true)
            }
            up.removeFile(err.file)
            uploadManager.doneFiles.push(err.file)
            uploadManager.uploadingCount--
            $scope.$apply()
          },
          UploadComplete() {
          },
          Key(up, file) {
            return file.key
          }
        }
      }

    })
