angular.module('onepiece')
  .factory('toast',
    ($mdToast) => {
      const toast = {}
      toast.show = (text, type, stayLong, position) => {
        $mdToast.show(
          $mdToast
            .simple()
            .textContent(text)
            .position(position || 'top right')
            .theme((type || 'success') + '-toast')
            .hideDelay(stayLong ? 4500 : 1500)
        )
      }

      return toast
    })
