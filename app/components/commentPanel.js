/**
 * Created by exincoda on 16/8/13.
 */

angular.module('onepiece')
  .component('commentPanel', {
    template: `
      <comment-input ng-show="user.status === 'ONLINE'"></comment-input>
      <div ng-show="user.status === 'ONLINE'" layout layout-align="space-between center" layout-wrap>
        <sign></sign>
        <div>
          <md-button class="md-raised" ng-class="comment?'md-primary':''" ng-click="sendComment()">提交
          </md-button>
        </div>
      </div>
    `,
    controller: function ($scope, user, comment) {
      "use strict";
      $scope.cm = comment;
      $scope.user = user;
    },
    bindings: {}
  });
