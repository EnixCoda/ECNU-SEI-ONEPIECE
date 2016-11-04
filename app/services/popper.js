angular.module('onepiece')
  .factory('popper',
    function ($mdDialog, $mdMedia, $injector) {
      var popper = {};
      var status = null;
      popper.hide = target => {
        (!target || target === status) && $mdDialog.hide();
      };
      popper.showUserCenter = function (e) {
        status = 'user center';
        $mdDialog.show({
          controller: 'UserCenterController',
          templateUrl: 'user_center.html',
          targetEvent: e,
          locals: {},
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: true,
          onRemoving: () => status = null
        });
      };
      popper.showUpload = function (e) {
        status = 'upload';
        $mdDialog.show({
          controller: 'UploadController',
          templateUrl: 'upload.html',
          targetEvent: e,
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: false,
          preserveScope: true,
          locals: {},
          onComplete: function ($scope) {
            $scope.QUploader = Qiniu.uploader($scope.QUploaderConfig);
          },
          onRemoving: () => status = null
        });
      };
      popper.showRanking = function (e) {
        status = 'ranking';
        $mdDialog.show({
          controller: 'RankingController',
          templateUrl: 'ranking.html',
          locals: {},
          targetEvent: e,
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: true,
          onRemoving: () => status = null
        });
      };
      popper.showAbout = function (e) {
        status = 'about';
        $mdDialog.show({
          controller: 'AboutController',
          templateUrl: 'about.html',
          targetEvent: e,
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: true,
          onRemoving: () => status = null
        });
      };
      popper.showFileDetail = function (file, e) {
        status = 'file detail';
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
            // use $injector to avoid bi-direction dep
            $injector.get('explorer').goBack();
            status = null;
          }
        });
      };
      popper.showLessonPreview = function (lesson, e) {
        status = 'lesson preview';
        $mdDialog.show({
          controller: 'LessonPreviewController',
          templateUrl: 'lesson_preview.html',
          targetEvent: e,
          locals: {
            lesson: lesson
          },
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: true,
          onRemoving: () => status = null
        });
      };
      popper.showEdit = function (item, e) {
        status = 'edit';
        $mdDialog.show({
          controller: 'EditController',
          templateUrl: 'edit.html',
          targetEvent: e,
          locals: {
            target: item
          },
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: true,
          onRemoving: () => status = null
        });
      };

      return popper;
  });
