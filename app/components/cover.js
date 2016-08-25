angular.module('onepiece')
  .component('onepieceCover', {
    template: `
      <div class="fill-height" flex layout="row" layout-align="center center" layout-padding>
        <md-progress-circular ng-if="indexLoader.loading" md-mode="indeterminate" md-diameter="40"></md-progress-circular>
        <div ng-if="indexLoader.failed">
          <md-icon class="material-icons md-warn">report_problem</md-icon>
          <span>读取文件列表失败</span>
        </div>
      </div>
    `,
    controller: function ($scope, indexLoader) {
      $scope.indexLoader = indexLoader;
    }
  });
