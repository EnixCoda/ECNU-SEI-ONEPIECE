/**
 * Created by Exin on 2016/3/2.
 */

angular.module('app', [
    'ngMaterial'
  ])
  .config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('error-toast');
  })
  .config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('success-toast');
  })
  .config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('warning-toast');
  });
