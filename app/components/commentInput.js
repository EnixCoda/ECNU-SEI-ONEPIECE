angular.module('onepiece')
  .component('commentInput', {
    template: `
      <need-login></need-login>
      <div ng-show="user.status === 'ONLINE'" class="user-comment-panel md-whiteframe-4dp">
        <div layout layout-wrap>
          <md-input-container flex class="no-margin">
            <label for="comment">你的评论</label>
            <textarea id="comment" ng-model="cm.comment" md-maxlength="140" md-no-autogrow maxlength="140" rows="2"></textarea>
          </md-input-container>
        </div>
        <div layout layout-align="space-between center" layout-wrap>
          <sign></sign>
          <md-button class="md-raised md-primary" ng-disabled="!cm.comment" ng-click="cm.send()">提交</md-button>
        </div>
      </div>
    `,
    controller($scope, user, comment) {
      $scope.cm = comment
      $scope.user = user
    }
  })
