angular.module('onepiece')
  .controller('LessonPreviewController',
    function ($scope, $mdDialog, $http, comment, lesson, popper) {
      $scope.comment = comment;
      $scope.lesson = lesson;
      $scope.popper = popper;

      comment.set('lesson', lesson);
      comment.get();
    });
