angular.module('onepiece')
  .component('onepieceFooter', {
    template: `
      <md-subheader class="light-background-color" ng-class="isNanoScreen?'nano-padding':''">
        <span>想得到我的财宝吗？想要的话可以全部给你，去找吧，伟大航路！我把世界上的一切都放在那里！——海贼王<del>站长</del>Gol·D·Roger</span>
      </md-subheader>
    `,
    controller: function () {}
  });