/**
 * Created by exincoda on 16/8/13.
 */

angular.module('onepiece')
  .component('commentInput', {
    template: `
      <div layout layout-wrap>
        <md-input-container flex class="no-margin">
          <label for="comment">你的评论</label>
          <textarea id="comment" ng-model="cm.comment" md-maxlength="140" md-no-autogrow maxlength="140" rows="2"></textarea>
        </md-input-container>
      </div>
    `,
    controller: function ($scope, user, comment) {
      'use strict';
      $scope.cm = comment;
      $scope.user = user;
    }
  });
