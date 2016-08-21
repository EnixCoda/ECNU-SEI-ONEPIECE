angular.module('onepiece')
  .component('onepiecePanel', {
    template: `
      <div ng-if="!indexLoader.loading" class="fill-height" layout="column">
        <onepiece-header></onepiece-header>
        <div class="protect-overflow">
          <file-list></file-list>
          <onepiece-footer></onepiece-footer>
        </div>
      </div>
    `,
    controller: function ($scope, indexLoader) {
      $scope.indexLoader = indexLoader;
    }
  });
