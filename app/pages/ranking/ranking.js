angular.module('onepiece')
  .controller('RankingController',
    ($scope, $mdBottomSheet, $document, $http, user, toast, popper) => {
      $scope.user = user
      $scope.popper = popper

      $scope.statuses = ['STANDBY', 'CONNECTING', 'SUCCESS', 'FAIL']
      $scope.status = $scope.statuses[0]

      const getRanking = () => {
        $scope.status = $scope.statuses[1]
        $http.get('ranking')
          .then((response) => {
            const responseData = response.data
            if (responseData['res_code'] === 0) {
              $scope.ranking = responseData['data']['ranking']
              $scope.userRanking = responseData['data']['userRanking']
              $scope.status = $scope.statuses[2]
            } else {
              $scope.status = $scope.statuses[3]
            }
          }, () => {
            toast.show('无法获取排行', 'error')
            $scope.status = $scope.statuses[3]
          })
      }

      getRanking()
    })
