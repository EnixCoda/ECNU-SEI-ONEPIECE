/**
 * Created by exincoda on 16/8/13.
 */

angular.module('onepiece')
  .component('commentPanel', {
    template: `
      <div class="user-comment-panel md-whiteframe-4dp">
        <comment-input ng-show="user.status === 'ONLINE'"></comment-input>
        <div ng-show="user.status === 'ONLINE'" layout layout-align="space-between center" layout-wrap>
          <sign></sign>
          <div>
            <md-button class="md-raised md-primary" ng-disabled="!cm.comment" ng-click="cm.send()">提交
            </md-button>
          </div>
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
