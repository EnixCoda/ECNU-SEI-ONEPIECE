angular.module('onepiece')
  .component('header', {
    template: `
      <div class="top-banner md-whiteframe-3dp light-background-color left-offset-10" layout
          layout-align="space-between center" layout-wrap>
        <md-button class="back-btn md-fab md-mini background-blue" ng-class="explorer.path.length>1 ? 'active':'hidden'" ng-click="explorer.goBack(1)">
          <md-icon class="material-icons color-white adjust-icon-top-margin-up-3">chevron_left</md-icon>
        </md-button>
        <div layout layout-align="end center">
          <search></search>
          <mobile-menu ng-if="isMobile" funcs="topFuncs">
          </mobile-menu>
          <normal-menu ng-if="!isMobile" funcs="topFuncs">
          </normal-menu>
        </div>
      </div>
    `,
    controller: function ($scope, explorer, popper) {
      $scope.explorer = explorer;

      // top-right menu
      $scope.topFuncs = [
        {
          func: popper.showUserCenter,
          icon: 'account_circle',
          tip: '用户中心'
        },
        {
          func: popper.showContribute,
          icon: 'cloud_upload',
          tip: '上传资料'
        },
        {
          func: popper.showRanking,
          icon: 'format_list_numbered',
          tip: '贡献度排行'
        },
        {
          func: popper.showAbout,
          icon: 'info_outline',
          tip: '关于本站'
        }
      ];
    }
  });