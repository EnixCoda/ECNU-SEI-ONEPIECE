angular.module('onepiece')
  .component('rate', {
    template: `
      <div layout layout-align="start center">
        <md-button class="md-icon-button no-margin-y" ng-click="rate.send(1)" ng-disabled="user.status !== 'ONLINE'">
          <md-tooltip md-direction="top">+1</md-tooltip>
          <md-icon class="material-icons" ng-class="user.status === 'ONLINE' ? 'thumb-up-enabled' : ''">thumb_up</md-icon>
        </md-button>
        <div layout layout-align="start center">
          <h3 ng-show="!rate.file.gettingRate" class="no-margin" ng-bind="rate.file.score">
            <md-tooltip md-direction="top">当前评分</md-tooltip>
          </h3>
          <md-progress-circular ng-show="rate.file.gettingRate" md-diameter="20" md-mode="indeterminate"></md-progress-circular>
        </div>
        <md-button class="md-icon-button no-margin-y" ng-click="rate.send(-2)" ng-disabled="user.status !== 'ONLINE'">
          <md-tooltip md-direction="top">-2</md-tooltip>
          <md-icon class="material-icons" ng-class="user.status === 'ONLINE' ? 'thumb-down-enabled' : ''">thumb_down</md-icon>
        </md-button>
      </div>
    `,
    controller($scope, user, rate) {
      $scope.user = user
      $scope.rate = rate
    }
  })