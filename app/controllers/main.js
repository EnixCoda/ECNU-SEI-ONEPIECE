angular.module('onepiece')
  .controller('MainController',
    function ($scope, $http, $mdDialog, $timeout, $mdMedia, SJAX, indexLoader, showUserCenter, explorer, user, toast, utility, downloader, cookie) {
      $scope.toastBound = 'bodyToastBounds';
      // TODO: modularize main page

      $scope.getFileColor = utility.getFileColor;
      $scope.getFileIcon = utility.getFileIcon;
      $scope.formatFileSize = utility.formatFileSize;
      $scope.getContentNameStyle = utility.getContentNameStyle;

      $scope.downloadFile = downloader.downloadFile;
      $scope.downloadLesson = downloader.downloadLesson;

      $scope.user = user;
      $scope.explorer = explorer;

      // TODO: service?
      function checkNanoScreen() {
        $scope.isNanoScreen = Math.min(utility.getWindowSize().width, utility.getWindowSize().height) < 340;
        if ($scope.isNanoScreen) {
          alert('检测到当前设备屏幕较小，已为您隐藏返回按钮。想要返回上级目录请点击当前路径中的文件夹名。点击“ONEPIECE”即可回到根目录。');
        }
      }

      $scope.openNestedMenu = function ($mdOpenMenu, $e) {
        $e.stopPropagation();
        $mdOpenMenu($e);
      };

      // TODO: BUG: not working well in some browsers like Chrome
      // lesson lessonSearcher
      $scope.lessonSearcher = {};
      $scope.lessonSearcher.search = function () {
        function listenerGenerator(lesson) {
          return function () {
            $scope.lessonSearcher.goDirectTo(lesson);
            document.querySelector('.lesson-search input').blur();
            $scope.$apply();
          };
        }

        var key = document.getElementById('lessonSearcherKey').value.toLowerCase();
        var results = lessons.filter(function (lesson) {
          return lesson.name.toLowerCase().indexOf(key) > -1;
        });
        var searchResultsElement = document.querySelector('.search-results');
        searchResultsElement.innerHTML = '';
        results = results.length > 0 ? results : [{name: '找不到课程\'' + key + '\''}];
        for (var i = 0; i < results.length; i++) {
          var searchResultElement = document.createElement('div');
          searchResultElement.classList.add('search-result');
          searchResultElement.innerHTML = results[i].name;
          var lesson = results[i];
          searchResultElement.addEventListener('click', listenerGenerator(lesson));
          searchResultsElement.appendChild(searchResultElement);
        }
      };
      $scope.lessonSearcher.active = function () {
        this.search();
      };
      $scope.lessonSearcher.clearKey = function () {
        document.getElementById('lessonSearcherKey').value = '';
        this.search();
      };
      $scope.lessonSearcher.goDirectTo = function (lesson) {
        if (lesson && lesson.path) {
          while ($scope.explorer.goBack(1)) {}
          var dummyPath = [].concat(lesson.path);
          while (dummyPath.length > 0) {
            $scope.explorer.goTo(dummyPath.shift());
          }
        }
      };

      // show dialogs start
      $scope.showUserCenter = showUserCenter;

      $scope.showFileDetail = function (file, e) {
        $mdDialog.show({
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
      $scope.showEdit = function (item, e) {
        $mdDialog.show({
          controller: 'EditController',
          templateUrl: 'edit.html',
          targetEvent: e,
          locals: {
            item: item
          },
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: true
        });
      };
      $scope.showLessonPreview = function (lesson, e) {
        $mdDialog.show({
          controller: 'LessonPreviewController',
          templateUrl: 'lesson_preview.html',
          targetEvent: e,
          locals: {
            lesson: lesson
          },
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: true
        });
      };
      $scope.showContribute = function (e) {
        $mdDialog.show({
          // TODO: injections
          controller: 'UploadController',
          templateUrl: 'upload.html',
          targetEvent: e,
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: false,
          locals: {},
          onComplete: function (uploadControllerScope) {
            // TODO: make it a service?
            uploadControllerScope.QUploader = Qiniu.uploader({
              runtimes: 'html5',
              browse_button: 'pickfiles',
              // uptoken_url: 'uploadToken',
              uptoken_func: function (file) {
                return SJAX.run('GET', 'uploadToken', {
                  token: user.token,
                  key: uploadControllerScope.explorer.path.slice(1).map(function (cur) {
                    return cur.name;
                  }).concat([file.name]).join('/')
                }, function (responseText) {
                  var res = JSON.parse(responseText);
                  if (res['res_code'] === 0) {
                    file.validToken = true;
                    return res['data']['uptoken'];
                  } else {
                    toast.show(file.name + ' 上传失败：' + res['msg'], '', 'error', true);
                    return '';
                  }
                }, function () {
                  toast.show('服务器错误', '', 'error', true);
                  return '';
                }, function () {
                  toast.show('无法连接到服务器', '', 'error', true);
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
                  uploadControllerScope.$apply();
                },
                BeforeUpload: function (/*up, file*/) {
                  uploadControllerScope.uploadingCount++;
                },
                UploadProgress: function (/*up, file*/) {
                  if (!uploadControllerScope.canceling) uploadControllerScope.$apply();
                  else uploadControllerScope.canceling = false;
                },
                FileUploaded: function (up, file, info) {
                  info = JSON.parse(info);
                  var data = {
                    token: uploadControllerScope.user.token,
                    fileId: info['etag'],
                    filePath: info['key']
                  };
                  $http.post('uploaded', data);
                  up.removeFile(file);
                  file.success = true;
                  uploadControllerScope.doneFiles.push(file);
                  uploadControllerScope.uploadingCount--;
                  uploadControllerScope.$apply();
                },
                Error: function (up, err, errTip) {
                  if (err.file.validToken) {
                    toast.show('上传失败! ' + err.file.name + ': ' + errTip, uploadControllerScope.toastBound, 'error', true);
                  }
                  up.removeFile(err.file);
                  uploadControllerScope.doneFiles.push(err.file);
                  uploadControllerScope.uploadingCount--;
                  uploadControllerScope.$apply();
                },
                UploadComplete: function () {
                },
                Key: function (up, file) {
                  return uploadControllerScope.explorer.path.slice(1).map(
                    function (cur) {
                      return cur.name;
                    }
                  ).concat([file.name]).join('/');
                }
              }
            });
          }
        });
      };
      $scope.showRanking = function (e) {
        $mdDialog.show({
          controller: 'RankingController',
          templateUrl: 'ranking.html',
          locals: {},
          targetEvent: e,
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: false
        });
      };
      $scope.showAbout = function (e) {
        $mdDialog.show({
          controller: 'AboutController',
          templateUrl: 'about.html',
          targetEvent: e,
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: true
        });
      };
      // show dialogs end

      // top-right menu
      $scope.topFuncs = [
        {
          func: $scope.showUserCenter,
          icon: 'account_circle',
          tip: '用户中心'
        },
        {
          func: $scope.showContribute,
          icon: 'cloud_upload',
          tip: '上传资料'
        },
        {
          func: $scope.showRanking,
          icon: 'format_list_numbered',
          tip: '贡献度排行'
        },
        {
          func: $scope.showAbout,
          icon: 'info_outline',
          tip: '关于本站'
        }
      ];

      // init
      checkNanoScreen();
      $scope.isMobile = utility.isMobile();
      $scope.delay = $scope.isMobile ? 0 : 300;
    });
