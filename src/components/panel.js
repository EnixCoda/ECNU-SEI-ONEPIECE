import angular from 'angular'

export default angular.module('onepiece')
  .component('onepiecePanel', {
    template: `
      <div class="fill-height" layout="column">
        <onepiece-header></onepiece-header>
        <file-list flex></file-list>
      </div>
    `,
    controller($scope, indexLoader) {
      $scope.indexLoader = indexLoader
    }
  })
