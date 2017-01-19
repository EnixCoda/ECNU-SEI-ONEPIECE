angular.module('onepiece')
  .factory('popper',
    ($mdDialog, $mdPanel, $mdMedia, $injector) => {
      let status = null

      const popper = {}

      popper.hide = target => {
        (!target || target === status) && $mdDialog.hide()
      }
      popper.showUserCenter = (e) => {
        status = 'user center'
        $mdDialog.show({
          controller: 'UserCenterController',
          templateUrl: 'user_center.html',
          targetEvent: e,
          locals: {},
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: true,
          onRemoving: () => status = null
        })
      }
      popper.showUpload = (e) => {
        status = 'upload'
        $mdDialog.show({
          controller: 'UploadController',
          templateUrl: 'upload.html',
          targetEvent: e,
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: false,
          preserveScope: true,
          locals: {},
          onComplete: $scope => {
            $scope.QUploader = Qiniu.uploader($scope.QUploaderConfig)
          },
          onRemoving: () => status = null
        })
      }
      popper.showRanking = (e) => {
        status = 'ranking'
        $mdDialog.show({
          controller: 'RankingController',
          templateUrl: 'ranking.html',
          locals: {},
          targetEvent: e,
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: true,
          onRemoving: () => status = null
        })
      }
      popper.showAbout = (e) => {
        status = 'about'
        $mdDialog.show({
          controller: 'AboutController',
          templateUrl: 'about.html',
          targetEvent: e,
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: true,
          onRemoving: () => status = null
        })
      }
      popper.showFileDetail = (file, e) => {
        status = 'file detail'
        $mdDialog.show({
          controller: 'FilePreviewController',
          templateUrl: 'file_detail.html',
          targetEvent: e,
          locals: {
            file: file
          },
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: true,
          onRemoving(/* element, promise */) {
            // use $injector to avoid bi-direction dep
            $injector.get('explorer').goBack()
            status = null
          }
        })
      }
      popper.showLessonPreview = (lesson, e) => {
        status = 'lesson preview'
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
        })
      }
      popper.showEdit = (item, e) => {
        status = 'edit'
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
        })
      }
      popper.showPreviewPanel = ($e, file) => {
        const config = {
          attachTo: angular.element(document.body),
          controller: 'PreviewPanelController',
          locals: {
            file
          },
          templateUrl: 'preview.html',
          panelClass: 'panel-preview',
          position: $mdPanel.newPanelPosition().center(),
          focusOnOpen: true,
          zIndex: 128,
          disableParentScroll: true,
          hasBackdrop: true,
          trapFocus: true,
        }
        $mdPanel.open(config)
      }

      return popper
    })
