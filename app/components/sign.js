/**
 * Created by exincoda on 16/8/13.
 */

angular.module('onepiece')
  .component('sign', {
    template: `
      <div layout layout-align="start center">
        <md-checkbox class="no-margin" ng-model="user.anonymous">
          匿名
        </md-checkbox>
        <md-input-container flex-xs class="no-margin" ng-show="!user.anonymous">
          <label for="username">留个昵称</label>
          <input id="username" type="text" ng-model="user.username" placeholder="{{user.name}}">
        </md-input-container>
      </div>
    `,
    controller: function ($scope, user) {
      $scope.user = user;
    }
  });
