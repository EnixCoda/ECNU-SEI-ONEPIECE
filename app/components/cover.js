angular.module('onepiece')
  .component('onepieceCover', {
    template: `
      <div class="fill-height" flex layout="row" layout-align="center center" layout-padding>
        <md-progress-circular ng-if="indexLoader.status === 'LOADING'" md-mode="indeterminate" md-diameter="40"></md-progress-circular>
        <div ng-if="indexLoader.status === 'FAILED'">
          <md-icon class="material-icons md-warn">report_problem</md-icon>
          <span>读取文件列表失败</span>
        </div>
      </div>
      <i class="material-icons invisible">stars</i><!--for earlier icon set loading-->
    `,
    controller($scope, indexLoader) {
      $scope.indexLoader = indexLoader
    }
  })
