angular.module('onepiece')
  .component('needLogin', {
    template: `
      <div ng-show="user.status !== 'ONLINE'">
        <span>使用校内数据库账户登录后即可评价。</span>
        <md-button class="md-raised md-primary" ng-click="showUserCenter()">登陆</md-button>
      </div>
    `,
    controller: function ($scope, user, popper) {
      $scope.showUserCenter = popper.showUserCenter;
      $scope.user = user;
    }
  });
