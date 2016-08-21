angular.module('onepiece')
  .component('onepiecePanel', {
    template: `
      <div ng-if="!indexLoader.loading" class="fill-height" layout="column">
        <onepiece-header></onepiece-header>
        <file-list></file-list>
      </div>
    `,
    controller: function ($scope, indexLoader) {
      $scope.indexLoader = indexLoader;
    }
  });
