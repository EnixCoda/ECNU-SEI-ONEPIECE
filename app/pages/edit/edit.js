/**
 * Created by exincoda on 16/8/13.
 */

angular.module('onepiece')
  .controller('EditController',
    function ($scope, $mdDialog, $http, explorer, item, user, toast) {
      $scope.toastBound = 'editToastBounds';

      $scope.item = item;
      $scope.original = [].concat(explorer.path).concat([item]).map(function (cur) {
        return cur.name;
      }).slice(1).join('/');

      $scope.statuses = ['STANDBY', 'CONNECTING', 'SUCCESS', 'FAIL'];
      $scope.getEditsStatus = $scope.statuses[0];

      function getEdit() {
        $scope.getEditsStatus = $scope.statuses[1];
        $http.get('edit', {
          params: {
            path: explorer.path.slice(1).map(function (cur) {
              return cur.name;
            }).join('/') + '/' + item.name
          }
        })
          .then(function (response) {
              var responseData = response['data'];
              if (responseData['res_code'] === 0) {
                $scope.edits = responseData['data']['edits'];
                $scope.getEditsStatus = $scope.statuses[2];
              } else {
                toast.show(responseData['msg'], $scope.toastBound, 'error');
                $scope.getEditsStatus = $scope.statuses[3];
              }
            },
            function () {
              toast.show('无法连接到服务器', $scope.toastBound, 'error');
              $scope.getEditsStatus = $scope.statuses[3];
            });
      }

      getEdit();

      $scope.actionName = '移动';
      $scope.nameAction = function (actionName) {
        $scope.actionName = actionName;
      };

      $scope.explorer = explorer;

      $scope.namingDirKeyPress = function (e) {
        if (e.keyCode === 13 && $scope.explorer.newDirName) {
          $scope.explorer.saveDir($scope.explorer.newDirName);
        }
      };

      // RENAME
      $scope.newName = '';

      $scope.submit = function (type, edit) {
        var data = {
          type: type,
          token: user.token,
          original: $scope.original
        };
        if (!edit) {
          switch (type) {
            case 'MOVE':
              if ($scope.explorer.path.length < 3) {
                toast.show('无法移动到目标路径', $scope.toastBound, 'warning');
                return;
              }
              data['edit'] = $scope.explorer.path.map(function (cur) {
                return cur.name;
              }).slice(1).join('/');
              break;
            case 'TRASH':
              data['edit'] = '-';
              break;
            case 'RENAME':
              data['edit'] = $scope.newName;
              break;
            default:
              return;
          }
        } else {
          data['edit'] = edit;
        }
        toast.show('正在提交', $scope.toastBound, 'success');
        $http.post('edit', data)
          .then(function (response) {
              var responseData = response['data'];
              if (responseData['res_code'] === 0) {
                toast.show(responseData['msg'], $scope.toastBound, 'success');
                getEdit();
              } else {
                toast.show(responseData['msg'], $scope.toastBound, 'error');
              }
            },
            function () {
              toast.show('无法连接到服务器', $scope.toastBound, 'error');
            });
      };

      $scope.close = function () {
        $mdDialog.cancel();
      };
    });