angular.module('onepiece')
  .component('mobileMenu', {
    template: `
      <md-menu md-position-mode="target-right target">
        <md-button class="md-raised top-right-menu background-white" ng-click="$mdOpenMenu($event)">
          <md-icon class="material-icons adjust-icon-top-margin-up-3 color-grey">more_vert</md-icon>
        </md-button>
        <md-menu-content width="3">
          <md-menu-item ng-repeat="func in funcs">
            <md-button ng-click="func.func($event)" layout layout-align="center center">
              <md-icon class="material-icons color-primary adjust-icon-top-margin-down">{{func.icon}}</md-icon>
              <div flex></div>
              <p md-menu-align-target>{{func.tip}}</p>
            </md-button>
          </md-menu-item>
        </md-menu-content>
      </md-menu>
      `,
    controller: function ($scope) {
      $scope.funcs = this.funcs;
    },
    bindings: {
      funcs: '='
    }
  });
