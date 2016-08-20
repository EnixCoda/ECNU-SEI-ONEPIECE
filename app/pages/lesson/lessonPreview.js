angular.module('onepiece')
  .controller('LessonPreviewController',
    function ($scope, $mdDialog, $http, comment, lesson) {
      $scope.toastBound = 'lessonPreviewToastBounds';

      $scope.comment = comment;
      $scope.lesson = lesson;

      comment.set('lesson', lesson);
      comment.get();

      $scope.cancel = $mdDialog.cancel;
    });
