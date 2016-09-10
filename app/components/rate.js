angular.module('onepiece')
  .component('rate', {
    template: `
      <div layout layout-align="start center">
        <md-button class="md-icon-button no-margin no-padding" ng-click="rate.send(1)" ng-disabled="user.status !== 'ONLINE'">
          <md-icon class="material-icons" ng-class="user.status === 'ONLINE' ? 'thumb-up-enabled' : ''">thumb_up</md-icon>
        </md-button>
        <md-button class="md-icon-button no-margin no-padding" ng-click="rate.send(-2)" ng-disabled="user.status !== 'ONLINE'">
          <md-icon class="material-icons" ng-class="user.status === 'ONLINE' ? 'thumb-down-enabled' : ''">thumb_down</md-icon>
        </md-button>
        <div layout layout-align="start center">
          <p>当前总分：</p>
          <h3 ng-show="!gettingRate" class="no-margin">{{file.totalScore}}</h3>
          <md-progress-circular ng-show="rate.gettingRate" md-diameter="20" md-mode="indeterminate"></md-progress-circular>
        </div>
      </div>
    `,
    controller: function ($scope, user, rate) {
      $scope.file = this.file;
      $scope.user = user;
      $scope.rate = rate;
    },
    bindings: {
      file: '='
    }
  });