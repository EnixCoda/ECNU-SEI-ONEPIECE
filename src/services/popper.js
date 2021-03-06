import angular from 'angular'

export default angular.module('onepiece')
  .factory('popper',
    ($mdDialog, $mdPanel, $mdMedia, $injector) => {
      let state = null

      const popper = {}

      popper.hide = target => {
        (!target || target === state) && $mdDialog.hide()
      }
      popper.showUserCenter = (e) => {
        state = 'user center'
        $mdDialog.show({
          controller: 'UserCenterController',
          template: require('../pages/user/user_center.html'),
          targetEvent: e,
          locals: {},
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: true,
          onRemoving: () => state = null
        })
      }
      popper.showUpload = (e) => {
        state = 'upload'
        $mdDialog.show({
          controller: 'UploadController',
          template: require('../pages/upload/upload.html'),
          targetEvent: e,
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: false,
          preserveScope: true,
          locals: {},
          onComplete: $scope => {
            $scope.QUploader = Qiniu.uploader($scope.QUploaderConfig)
          },
          onRemoving: () => state = null
        })
      }
      popper.showRanking = (e) => {
        state = 'ranking'
        $mdDialog.show({
          controller: 'RankingController',
          template: require('../pages/ranking/ranking.html'),
          locals: {},
          targetEvent: e,
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: true,
          onRemoving: () => state = null
        })
      }
      popper.showAbout = (e) => {
        state = 'about'
        $mdDialog.show({
          controller: 'AboutController',
          template: require('../pages/about/about.html'),
          targetEvent: e,
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: true,
          onRemoving: () => state = null
        })
      }
      popper.showFileDetail = (file, e) => {
        state = 'file detail'
        $mdDialog.show({
          controller: 'FilePreviewController',
          template: require('../pages/file/file_detail.html'),
          targetEvent: e,
          locals: {
            file: file
          },
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: true,
          onRemoving(/* element, promise */) {
            // use $injector to avoid bi-direction dep
            $injector.get('explorer').goBack()
            state = null
          }
        })
      }
      popper.showLessonPreview = (lesson, e) => {
        state = 'lesson preview'
        $mdDialog.show({
          controller: 'LessonPreviewController',
          template: require('../pages/lesson/lesson_preview.html'),
          targetEvent: e,
          locals: {
            lesson: lesson
          },
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: true,
          onRemoving: () => state = null
        })
      }
      popper.showEdit = (item, e) => {
        state = 'edit'
        $mdDialog.show({
          controller: 'EditController',
          template: require('../pages/edit/edit.html'),
          targetEvent: e,
          locals: {
            target: item
          },
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: true,
          onRemoving: () => state = null
        })
      }
      popper.showPreviewPanel = ($e, file) => {
        const config = {
          attachTo: angular.element(document.body),
          controller: 'PreviewPanelController',
          locals: {
            file
          },
          template: require('../pages/preview/preview.html'),
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
