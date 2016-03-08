/**
 * Created by Exin on 2016/3/2.
 */

angular.module('app', [
    'ngMaterial'
  ])
  .config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('orange')
      .warnPalette('red');
  });
