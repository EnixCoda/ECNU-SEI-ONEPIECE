angular.module('onepiece')
  .factory('popper',
    function ($mdDialog, $mdMedia, $injector) {
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
          controller: 'UploadController',
          templateUrl: 'upload.html',
          targetEvent: e,
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: false,
          locals: {},
          onComplete: function ($scope) {
            $scope.QUploader = Qiniu.uploader($scope.QUploaderConfig);
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
          clickOutsideToClose: true
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
          clickOutsideToClose: true,
          onRemoving: function (/* element, promise */) {
            $injector.get('explorer').goBack();
          }
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
            target: item
          },
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: true
        });
      };

      return popper;
  });
