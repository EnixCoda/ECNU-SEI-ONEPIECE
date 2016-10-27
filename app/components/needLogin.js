angular.module('onepiece')
  .component('needLogin', {
    template: `
      <div ng-if="user.status !== 'ONLINE'" class="center-text">
        <span>请先使用校内数据库账户登录。</span>
        <md-button class="md-raised md-primary" ng-click="showUserCenter()">登陆</md-button>
      </div>
    `,
    controller: function ($scope, user, popper) {
      $scope.showUserCenter = popper.showUserCenter;
      $scope.user = user;
    }
  });
