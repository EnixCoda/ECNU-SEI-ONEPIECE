import angular from 'angular'

export default angular.module('onepiece')
  .controller('LessonPreviewController',
    ($scope,  $http, comment, lesson, popper) => {
      $scope.comment = comment
      $scope.lesson = lesson
      $scope.popper = popper

      comment.set('lesson', lesson)
      comment.get()
    })
