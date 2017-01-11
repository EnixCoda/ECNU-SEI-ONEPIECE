angular.module('onepiece')
  .component('needLogin', {
    template: `
      <div ng-if="user.status !== 'ONLINE'" class="center-text">
        <span>用校内数据库账户登录后开启更多功能。</span>
        <md-button class="md-raised md-primary" ng-click="showUserCenter()">登陆</md-button>
      </div>
    `,
    controller($scope, user, popper) {
      $scope.showUserCenter = popper.showUserCenter
      $scope.user = user
    }
  })
