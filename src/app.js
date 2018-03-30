import angular from 'angular'

export default angular.module('onepiece', ['ngMaterial', 'ngResource'])
  .config($mdThemingProvider => {
    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('orange')
      .warnPalette('deep-orange')
      .backgroundPalette('grey')
    $mdThemingProvider.theme('error-toast')
    $mdThemingProvider.theme('success-toast')
    $mdThemingProvider.theme('warning-toast')
  }).config(($resourceProvider) => {
    // Don't strip trailing slashes from calculated URLs
    $resourceProvider.defaults.stripTrailingSlashes = false
  })

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/assets/service-worker.js')
    .then(function() {
      console.log('service worker registered')
    }, function(e) {
      console.log('service worker register failed', e)
    })
}
