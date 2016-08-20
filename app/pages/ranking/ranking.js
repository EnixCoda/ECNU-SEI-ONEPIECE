angular.module('onepiece')
  .controller('RankingController',
    function ($scope, $mdDialog, $mdBottomSheet, $document, $http, user, toast, popper) {
      $scope.toastBound = 'rankingToastBounds';

      $scope.user = user;
      $scope.showUserCenter = popper.showUserCenter;

      $scope.statuses = ['STANDBY', 'CONNECTING', 'SUCCESS', 'FAIL'];

      $scope.status = $scope.statuses[0];

      function getRanking() {
        $scope.status = $scope.statuses[1];
        var data = {};
        if (user.status === 'ONLINE') {
          data.token = user.token;
        }
        $http.get('ranking', {
          params: data
        })
          .then(function (response) {
            var responseData = response.data;
            if (responseData['res_code'] === 0) {
              $scope.ranking = responseData['data']['ranking'];
              $scope.userRanking = responseData['data']['userRanking'];
              $scope.status = $scope.statuses[2];
            } else {
              $scope.status = $scope.statuses[3];
            }
          }, function () {
            toast.show('无法获取排行', $scope.toastBound, 'error');
            $scope.status = $scope.statuses[3];
          });
      }

      getRanking();

      $scope.showRule = function () {
        $mdBottomSheet.show({
          templateUrl: 'rule.html',
          controller: 'RuleController',
          clickOutsideToClose: false,
          parent: $document[0].querySelector('#ruleBottomSheetBounds')
        })
      };

      $scope.close = $mdDialog.hide;
    });
