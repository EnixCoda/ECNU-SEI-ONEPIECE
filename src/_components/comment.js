import angular from 'angular'

export default angular.module('onepiece')
  .component('comment', {
    template: `
      <comment-list></comment-list>
      <comment-input></comment-input>
    `,
    controller() {}
  })
