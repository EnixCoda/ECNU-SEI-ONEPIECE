angular.module('onepiece')
  .component('onepiecePanel', {
    template: `
      <div class="fill-height" layout="column">
        <header></header>
        <div class="protect-overflow">
          <file-list></file-list>
        </div>
      </div>
    `,
    controller: function () {}
  });
