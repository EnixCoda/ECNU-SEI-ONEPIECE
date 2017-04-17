angular.module('onepiece')
  .factory('toast',
    ($mdToast, $timeout) => {
      const toast = {}
      const minimumToastDuration = 1600
      const toastBuffer = []
      let lastToastTime = 0
      let toastPromise

      const show = () => {
        if (lastToastTime + minimumToastDuration <= new Date()) {
          toastPromise && toastPromise.then(() => $mdToast.hide())
          lastToastTime = +new Date()
          toastPromise = $mdToast.show(toastBuffer.shift())
        } else {
          $timeout(show, lastToastTime + minimumToastDuration - new Date())
        }
      }

      toast.show = (text, type, stayLong, position) => {
        toastBuffer.push(
          $mdToast
            .simple()
            .textContent(text)
            .position(position || 'top right')
            .theme((type || 'success') + '-toast')
            .hideDelay(stayLong ? 4500 : 1500)
        )
        show()
      }

      return toast
    })
