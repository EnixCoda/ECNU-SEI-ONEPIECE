/**
 * Created by exincoda on 16/8/13.
 */

angular.module('onepiece')
  .component('commentList', {
    template: `
      <div class="protect-overflow" flex>
        <md-list ng-show="cm.comments.length > 0">
          <md-subheader class="md-no-sticky">评论</md-subheader>
          <md-list-item ng-repeat="cmt in cm.comments"
                        ng-class="cmt.comment.length>100?'md-2-line md-long-text':'md-2-line'">
            <div class="md-list-item-text">
              <h3>{{cmt.username.length>0?cmt.username:"匿名"}} :</h3>
              <p>{{ cmt.comment }}</p>
            </div>
          </md-list-item>
        </md-list>
        <div ng-show="cm.comments.length === 0">
          <h3>暂无评论</h3>
        </div>
      </div>
      <div ng-show="cm.gettingComment" layout layout-align="start center">
        <md-progress-circular md-diameter="20" md-mode="indeterminate"></md-progress-circular>
        <p class="left-offset-10"> 正在加载评论... </p>
      </div>
    `,
    controller: function ($scope, comment) {
      'use strict';
      $scope.cm = comment;
    }
  });