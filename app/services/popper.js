angular.module('onepiece')
  .factory('popper',
    function ($mdDialog, $mdMedia) {
      var popper = {};
      popper.showUserCenter = function (e){
        $mdDialog.show({
          controller: 'UserCenterController',
          templateUrl: 'user_center.html',
          targetEvent: e,
          locals: {},
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: true
        });
      };
      popper.showContribute = function (e) {
        $mdDialog.show({
          // TODO: injections
          controller: 'UploadController',
          templateUrl: 'upload.html',
          targetEvent: e,
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: false,
          locals: {},
          onComplete: function (uploadControllerScope) {
            uploadControllerScope.QUploader = Qiniu.uploader(uploadControllerScope.QUploaderConfig);
          }
        });
      };
      popper.showRanking = function (e) {
        $mdDialog.show({
          controller: 'RankingController',
          templateUrl: 'ranking.html',
          locals: {},
          targetEvent: e,
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: false
        });
      };
      popper.showAbout = function (e) {
        $mdDialog.show({
          controller: 'AboutController',
          templateUrl: 'about.html',
          targetEvent: e,
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: true
        });
      };
      popper.showFileDetail = function (file, e) {
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
      popper.showLessonPreview = function (lesson, e) {
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
      popper.showEdit = function (item, e) {
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

      return popper;
  });
