angular.module('onepiece', ['ngMaterial'])
  .config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('orange')
      .warnPalette('deep-orange')
      .backgroundPalette('grey');
    $mdThemingProvider.theme('error-toast');
    $mdThemingProvider.theme('success-toast');
    $mdThemingProvider.theme('warning-toast');
  });
