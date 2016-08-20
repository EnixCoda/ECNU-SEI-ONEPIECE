angular.module('onepiece')
  .component('onepieceCover', {
    template: `
    <div flex layout="row" layout-align="center center" layout-padding>
      <md-progress-circular ng-if="!explorer.failed" md-mode="indeterminate" md-diameter="40"></md-progress-circular>
      <div>
        <md-icon ng-if="explorer.failed" class="material-icons md-warn">report_problem</md-icon>
      </div>
      <p>{{explorer.failed?"读取文件列表失败":"正在读取文件列表"}}</p>
    </div>
    `,
    controller: function ($scope, explorer) {
      $scope.explorer = explorer;
    }
  });