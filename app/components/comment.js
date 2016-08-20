angular.module('onepiece')
  .component('comment', {
    template: `
      <comment-list></comment-list>
      <need-login></need-login>
      <comment-panel></comment-panel>
    `,
    controller: function () {}
  });
