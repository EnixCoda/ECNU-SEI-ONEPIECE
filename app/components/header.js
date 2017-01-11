angular.module('onepiece')
  .component('onepieceHeader', {
    template: `
      <div class="top-banner md-whiteframe-3dp light-background-color" layout layout-align="space-between center">
        <div>
          <md-button ng-show="explorer.path.length>1" class="md-icon-button back-btn" ng-class="explorer.path.length > 1 ? 'active':'hidden'" ng-click="explorer.goBack(1)">
            <md-icon class="material-icons">keyboard_backspace</md-icon>
          </md-button>
        </div>
        <div layout layout-align="start center">
          <search></search>
          <mobile-menu ng-if="!$mdMedia('gt-xs')" funcs="topFuncs"></mobile-menu>
          <normal-menu ng-if="$mdMedia('gt-xs')" funcs="topFuncs"></normal-menu>
        </div>
      </div>
    `,
    controller($scope, $mdMedia, explorer, popper) {
      $scope.explorer = explorer
      $scope.$mdMedia = $mdMedia
      $scope.topFuncs = [
        {
          func: popper.showUserCenter,
          icon: 'account_circle',
          tip: '用户中心'
        },
        {
          func: popper.showUpload,
          icon: 'cloud_upload',
          tip: '上传资料'
        },
        {
          func: popper.showRanking,
          icon: 'format_list_numbered',
          tip: '积分排行'
        },
        {
          func: popper.showAbout,
          icon: 'info_outline',
          tip: '关于本站'
        }
      ]
    }
  })
