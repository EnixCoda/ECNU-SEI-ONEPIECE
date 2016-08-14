/**
 * Created by exincoda on 16/8/13.
 */

angular.module('onepiece')
  .factory('toast',
    function ($mdToast) {
      'use strict';
      var toast = {};
      toast.show = function (text, boundId, type, stayLong, position) {
        // $mdToast.show(
        //   toast
        //     .$mdToast
        //     .simple()
        //     .textContent(text)
        //     .position('top right')
        //     .parent($document[0].querySelector(boundId ? '#' + boundId : ''))
        //     .theme(type + '-toast')
        //     .hideDelay(stayLong ? 4500 : 1500)
        // );
        position = position || 'top right';
        $mdToast.show({
          template: `
              <md-toast md-theme="${type}-toast" ng-class="{'md-capsule': toast.capsule}" class="ng-scope md-${type}-toast-theme">
                <div class="md-toast-content">
                  <span flex class="md-toast-text ng-binding flex" role="alert" aria-relevant="all" aria-atomic="true">
                    ${text}
                  </span>
                </div>
              </md-toast>
            `,
          autoWrap: true,
          position: position,
          // parent: document.querySelector(boundId ? '#' + boundId : ''),
          hideDelay: stayLong ? 4500 : 1500,
          theme: type + '-toast'
        });
      };

      return toast;
    });
