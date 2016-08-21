angular.module('onepiece')
  .component('fileList', {
    template: `
      <div class="protect-overflow">
        <md-list class="no-padding">
          <md-subheader class="md-no-sticky lesson-route-header">
            <span class="lesson-route" ng-repeat="dir in explorer.path" ng-click="explorer.goBack(explorer.path.length - $index - 1)">
              <b>{{$index === 0 ? '' : ' &gt; '}}{{dir.name}}</b>
            </span>
          </md-subheader>
          <md-divider></md-divider>
          <item ng-repeat="content in explorer.path[explorer.path.length - 1].content" content="content"></item>
        </md-list>
      </div>
    `,
    controller: function($scope, explorer){
      $scope.explorer = explorer;
    }
  });
