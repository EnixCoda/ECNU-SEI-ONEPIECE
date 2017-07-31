angular.module('onepiece')
  .controller('RankingController',
    ($scope, $mdBottomSheet, $document, $http, user, toast, popper) => {
      $scope.user = user
      $scope.popper = popper

      $scope.states = ['STANDBY', 'CONNECTING', 'SUCCESS', 'FAIL']
      $scope.state = $scope.states[0]

      const getRanking = () => {
        $scope.state = $scope.states[1]
        $http.get('ranking')
          .then((response) => {
            const responseData = response.data
            if (responseData['res_code'] === 0) {
              $scope.ranking = responseData['data']['ranking']
              $scope.userRanking = responseData['data']['userRanking']
              $scope.state = $scope.states[2]
            } else {
              $scope.state = $scope.states[3]
            }
          }, () => {
            toast.show('无法获取排行', 'error')
            $scope.state = $scope.states[3]
          })
      }

      getRanking()
    })
