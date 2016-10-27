angular.module('onepiece')
  .component('onepiecePanel', {
    template: `
      <div class="fill-height" layout="column">
        <onepiece-header></onepiece-header>
        <file-list flex></file-list>
      </div>
    `,
    controller: function ($scope, indexLoader) {
      $scope.indexLoader = indexLoader;
    }
  });
