import angular from 'angular'

export default angular.module('onepiece')
  .controller('FilePreviewController',
    ($scope, file, user, comment, explorer, rate, utility, downloader, popper) => {
      $scope.user = user
      $scope.explorer = explorer
      $scope.popper = popper
      $scope.formatFileSize = utility.formatFileSize
      $scope.previewable = utility.previewable
      $scope.downloadFile = downloader.downloadFile
      $scope.previewFile = ($event) => {
        popper.showPreviewPanel($event, $scope.file)
      }
      const setContent = (content) => {
        $scope.file = content
        rate.set(content)
        rate.get()
        comment.set('file', content)
        comment.get()
      }

      const checkSliblings = () => {
        $scope.existNextFile = explorer.existNextFile
        $scope.existPreviousFile = explorer.existPreviousFile
      }

      explorer.getSliblingFile(0)
      checkSliblings()

      $scope.showNextFile = () => {
        const newFile = explorer.getSliblingFile(1)
        if (newFile) setContent(newFile)
        checkSliblings()
      }
      $scope.showPreviousFile = () => {
        const newFile = explorer.getSliblingFile(-1)
        if (newFile) setContent(newFile)
        checkSliblings()
      }

      setContent(file)
    })
