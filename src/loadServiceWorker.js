if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/assets/service-worker.js')
    .then(function() {
      console.log('service worker registered')
    }, function(e) {
      console.log('service worker register failed', e)
    })
}
