/**
 * Created by exincoda on 16/8/13.
 */

angular.module('onepiece')
  .component('needLogin', {
    template: `
      <div ng-show="user.status !== 'ONLINE'">
        使用校内数据库账户登录后即可评价。
        <md-button class="md-raised md-primary" ng-click="showUserCenter()">登陆</md-button>
      </div>
    `,
    controller: function ($scope, user, showUserCenter) {
      $scope.showUserCenter = showUserCenter;
      $scope.user = user;
    }
  });
