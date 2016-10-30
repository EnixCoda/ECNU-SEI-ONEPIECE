angular.module('onepiece')
  .controller('EditController',
    function ($scope, $mdDialog, $resource, indexLoader, target, explorer, user, toast, popper) {
      var Edit = $resource('edit', {}, {});

      $scope.explorer = explorer;
      $scope.popper = popper;

      $scope.original = explorer.path.slice(1).concat([target]).map(cur => cur.name).join('/');

      $scope.statuses = ['STANDBY', 'CONNECTING', 'SUCCESS', 'FAIL'];
      $scope.getEditsStatus = $scope.statuses[0];
      $scope.sendEditsStatus = $scope.statuses[0];

      function getEdit() {
        $scope.getEditsStatus = $scope.statuses[1];
        Edit.get({
          path: $scope.original
        },
          function (response) {
            if (response['res_code'] === 0) {
              $scope.edits = response['data']['edits'];
              $scope.getEditsStatus = $scope.statuses[2];
            } else {
              toast.show(response['msg'], 'error');
              $scope.getEditsStatus = $scope.statuses[3];
            }
          },
          function () {
            toast.show('无法连接到服务器', 'error');
            $scope.getEditsStatus = $scope.statuses[3];
          });
      }

      getEdit();

      $scope.actionName = '移动';
      $scope.nameAction = function (actionName) {
        $scope.actionName = actionName;
      };

      $scope.namingDirKeyPress = function (e) {
        if (e.keyCode === 13 && explorer.newDirName) {
          explorer.saveDir(explorer.newDirName);
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
              if (explorer.path.length < ['ONEPIECE', 'LESSON_TYPE'].length) {
                toast.show('无法移动到目标路径', 'warning');
                return;
              } else {
                data.edit = [].concat(explorer.path).concat([target]).map(function (cur) {
                  return cur.name;
                }).slice(1).join('/');
              }
              break;
            case 'TRASH':
              data.edit = '-';
              break;
            case 'RENAME':
              data.edit = $scope.newName;
              break;
            default:
              return;
          }
        } else {
          data.edit = edit;
        }
        toast.show('正在提交');
        $scope.sendEditsStatus = $scope.statuses[1];
        Edit.save(data,
          function (response) {
            $scope.sendEditsStatus = $scope.statuses[0];
            if (response['res_code'] === 0) {
              toast.show(response['msg']);
              getEdit();
              indexLoader.load();
            } else {
              toast.show(response['msg'], 'error');
            }
          },
          function () {
            $scope.sendEditsStatus = $scope.statuses[0];
            toast.show('无法连接到服务器', 'error');
          });
      };
    });
