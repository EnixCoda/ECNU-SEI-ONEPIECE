/**
 * Created by Exin on 2016/3/2.
 */

angular
  .module('onepiece', [
    'ngMaterial'
  ])
  .config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('error-toast');
    $mdThemingProvider.theme('success-toast');
    $mdThemingProvider.theme('warning-toast');
  });
