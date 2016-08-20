angular.module('onepiece')
  .component('normalMenu', {
    template: `
      <md-button class="md-fab md-mini background-white" ng-class="!$first?'no-margin-left':''" ng-repeat="func in funcs" ng-click="func.func($event)">
        <md-icon ng-if="(!user.name && $index === 0) || $index > 0" class="material-icons adjust-icon-top-margin-up-3 color-primary">
          {{func.icon}}
        </md-icon>
        <span ng-if="user.name && $index === 0" class="short-user-name color-primary">{{user.name ? user.name[0] : ""}}</span>
        <md-tooltip md-direction="bottom">
          {{func.tip}}
        </md-tooltip>
      </md-button>
    `,
    controller: function ($scope, user) {
      $scope.user = user;
      $scope.funcs = this.funcs;
    },
    bindings: {
      funcs: '='
    }
  });
