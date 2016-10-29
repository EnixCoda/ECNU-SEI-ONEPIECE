angular.module('onepiece')
  .component('normalMenu', {
    template: `
      <div layout>
        <md-button class="md-fab md-mini background-white" ng-class="!$first?'no-margin-left':''" ng-repeat="func in funcs" ng-click="func.func($event)">
          <md-icon ng-if="(!user.name && $index === 0) || $index > 0" class="material-icons  color-primary">
            {{func.icon}}
          </md-icon>
          <span ng-if="user.name && $index === 0" class="short-user-name color-primary">{{user.name ? user.name[0] : ""}}</span>
          <md-tooltip md-direction="bottom">
            {{func.tip}}
          </md-tooltip>
        </md-button>
       </div>
    `,
    controller: function ($scope, user) {
      $scope.user = user;
      $scope.funcs = this.funcs;
    },
    bindings: {
      funcs: '='
    }
  });
