angular.module('onepiece')
  .factory('toast',
    function ($mdToast) {
      var toast = {};
      toast.show = function (text, boundId, type, stayLong, position) {
        $mdToast.show(
          $mdToast
            .simple()
            .textContent(text)
            .position(position || 'top right')
            .theme(type + '-toast')
            .hideDelay(stayLong ? 4500 : 1500)
        );
      };

      return toast;
    });