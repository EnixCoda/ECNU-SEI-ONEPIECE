angular.module('onepiece')
  .factory('toast',
    ($mdToast, $timeout) => {
      const toast = {}
      const toastBuffer = []
      const MINIMUM_TOAST_DURATION = 1600
      let lastToastTime = 0
      let toastPromise

      const show = () => {
        const now = +new Date()
        if (lastToastTime + MINIMUM_TOAST_DURATION <= now) {
          toastPromise && toastPromise.then(() => $mdToast.hide())
          lastToastTime = now
          toastPromise = $mdToast.show(toastBuffer.shift())
        } else {
          $timeout(show, lastToastTime + MINIMUM_TOAST_DURATION - now)
        }
      }

      toast.show = (text, type = 'success', stayLong, position = 'top right') => {
        toastBuffer.push(
          $mdToast
            .simple()
            .textContent(text)
            .position(position)
            .theme(type + '-toast')
            .hideDelay(stayLong ? 4500 : 1500)
        )
        show()
      }

      return toast
    })
