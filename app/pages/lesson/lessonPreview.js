/**
 * Created by exincoda on 16/8/13.
 */

angular.module('onepiece')
  .controller('LessonPreviewController',
    function ($scope, $mdDialog, $http, lesson, user, showUserCenter) {
      $scope.toastBound = 'lessonPreviewToastBounds';

      $scope.lesson = lesson;
      $scope.user = user;
      $scope.showUserCenter = showUserCenter;
      $scope.anonymous = false;

      var commentManager = CommentManager.new($scope, $http, 'lesson', lesson.name);

      commentManager.get();

      $scope.sendComment = function () {
        if ($scope.comment) {
          commentManager.send();
        }
      };

      $scope.cancel = function () {
        $mdDialog.cancel();
      };
    });
