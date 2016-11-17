angular.module('onepiece')
  .component('sign', {
    template: `
      <div layout layout-align="start center">
        <md-checkbox class="no-margin" ng-model="user.anonymous">
          匿名
        </md-checkbox>
        <md-input-container class="no-margin thin-input" ng-show="!user.anonymous">
          <label for="alia">留个昵称</label>
          <input id="alia" type="text" ng-model="user.alia" placeholder="{{user.name}}">
        </md-input-container>
      </div>
    `,
    controller: function ($scope, user) {
      $scope.user = user;
    }
  });
