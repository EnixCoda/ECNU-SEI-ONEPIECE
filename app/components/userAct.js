/**
 * Created by exincoda on 16/8/13.
 */

angular.module('onepiece')
  .component('userAct', {
    template: `
      <div ng-show="user.status === 'ONLINE'" class="user-comment-panel md-whiteframe-5dp" layout="column">
        <comment-panel></comment-panel>
        <div layout layout-align="space-between center" layout-wrap>
          <sign></sign>
          <div>
            <md-button class="md-raised" ng-class="comment?'md-primary':''" ng-click="sendComment()">提交</md-button>
          </div>
        </div>
      </div>
      <need-login></need-login>
    `,
    controller: function () {}
  });