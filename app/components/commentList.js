angular.module('onepiece')
  .component('commentList', {
    template: `
      <div class="protect-overflow" flex>
        <md-list class="no-padding-top">
          <md-subheader class="md-no-sticky">评论</md-subheader>
          <md-list-item ng-show="cm.comments.length > 0" ng-repeat="cmt in cm.comments"
                        ng-class="cmt.comment.length>100?'md-2-line md-long-text':'md-2-line'">
            <div class="md-list-item-text">
              <h3>{{cmt.username.length>0?cmt.username:"匿名"}} :</h3>
              <p>{{ cmt.comment }}</p>
            </div>
          </md-list-item>
          <md-list-item ng-show="cm.comments.length === 0" ng-class="md-2-line">
            <div class="md-list-item-text">
              <h3>暂无评论</h3>
            </div>
          </md-list-item>
        </md-list>
      </div>
      <div ng-show="cm.gettingComment" layout layout-align="start center">
        <md-progress-circular md-diameter="20" md-mode="indeterminate"></md-progress-circular>
        <p class="left-offset-10"> 正在加载评论... </p>
      </div>
    `,
    controller: function ($scope, comment) {
      $scope.cm = comment;
    }
  });