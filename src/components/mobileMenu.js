import angular from 'angular'

export default angular.module('onepiece')
  .component('mobileMenu', {
    template: `
      <md-menu md-position-mode="target-right target">
        <md-button class="md-raised top-right-menu background-white" ng-click="$mdOpenMenu($event)">
          <md-icon class="material-icons  color-grey">more_vert</md-icon>
        </md-button>
        <md-menu-content width="3">
          <md-menu-item ng-repeat="func in funcs">
            <md-button ng-click="func.func($event)" layout layout-align="center center">
              <md-icon class="material-icons color-primary">{{func.icon}}</md-icon>
              <span flex></span>
              <p md-menu-align-target>{{func.tip}}</p>
            </md-button>
          </md-menu-item>
        </md-menu-content>
      </md-menu>
    `,
    controller($scope) {
      $scope.funcs = this.funcs
    },
    bindings: {
      funcs: '='
    }
  })
