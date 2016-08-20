angular.module('onepiece')
  .component('fileList', {
    template: `
      <md-list class="no-padding-top">
        <md-subheader class="md-no-sticky lesson-route-header">
          <span class="lesson-route" ng-click="explorer.goBack(explorer.path.length - 1)">
            <b>ONEPIECE</b>
          </span>
          <span class="lesson-route" ng-repeat="dir in explorer.path" ng-if="!$first"
                ng-click="explorer.goBack(explorer.path.length - $index - 1)">
            > <b>{{dir.name}}</b>
          </span>
        </md-subheader>
        <md-divider></md-divider>
        <item ng-repeat="content in explorer.path[explorer.path.length - 1].content" content="content"></item>
      </md-list>
    `,
    controller: function($scope, explorer, popper){
      $scope.explorer = explorer;
      $scope.showUserCenter = popper.showUserCenter;
      $scope.showFileDetail = popper.showFileDetail;
      $scope.showEdit = popper.showEdit;
      $scope.showLessonPreview = popper.showLessonPreview;
    }
  });
