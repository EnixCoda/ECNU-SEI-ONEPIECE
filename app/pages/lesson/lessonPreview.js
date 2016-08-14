/**
 * Created by exincoda on 16/8/13.
 */

angular.module('onepiece')
  .controller('LessonPreviewController',
    function ($scope, $mdDialog, $http, comment, lesson, user, showUserCenter) {
      $scope.toastBound = 'lessonPreviewToastBounds';

      $scope.lesson = lesson;
      $scope.user = user;
      $scope.showUserCenter = showUserCenter;
      $scope.anonymous = false;

      $scope.comment = comment;

      comment.set('lesson', lesson);
      comment.get();

      $scope.sendComment = function () {
        if ($scope.comment) {
          comment.send();
        }
      };

      $scope.cancel = function () {
        $mdDialog.cancel();
      };
    });
