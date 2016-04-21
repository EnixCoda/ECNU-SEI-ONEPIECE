/**
 * Created by Exin on 2016/3/2.
 */

angular.module('app', [
    'ngMaterial'
  ])
  .config(function($mdThemingProvider) {
    $mdThemingProvider.definePalette('white', {
      '50': 'ffffff',
      '100': 'ffffff',
      '200': 'ffffff',
      '300': 'ffffff',
      '400': 'ffffff',
      '500': 'ffffff',
      '600': 'ffffff',
      '700': 'ffffff',
      '800': 'ffffff',
      '900': 'ffffff',
      'A100': 'ffffff',
      'A200': 'ffffff',
      'A400': 'ffffff',
      'A700': 'ffffff'
    });
    //$mdThemingProvider.theme('default')
    //  //.primaryPalette('light-blue')
    //  .accentPalette('light-blue')
    //  //.warnPalette('grey')
    //  //.backgroundPalette('grey');
  });
