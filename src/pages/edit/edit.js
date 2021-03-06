import angular from 'angular'

export default angular.module('onepiece')
  .controller('EditController',
    ($scope, $resource, indexLoader, target, explorer, user, toast, popper) => {
      const Edit = $resource('edit', {}, {})

      $scope.explorer = explorer
      $scope.popper = popper

      $scope.original = explorer.path.slice(1).concat([target]).map(cur => cur.name).join('/')

      $scope.states = ['STANDBY', 'CONNECTING', 'SUCCESS', 'FAIL']
      $scope.getEditsState = $scope.states[0]
      $scope.sendEditsState = $scope.states[0]

      const getEdit = () => {
        $scope.getEditsState = $scope.states[1]
        Edit.get(
          { path: $scope.original },
          response => {
            if (response['res_code'] === 0) {
              $scope.edits = response['data']['edits']
              $scope.getEditsState = $scope.states[2]
            } else {
              toast.show(response['msg'], 'error')
              $scope.getEditsState = $scope.states[3]
            }
          },
          () => {
            toast.show('无法连接到服务器', 'error')
            $scope.getEditsState = $scope.states[3]
          })
      }

      getEdit()

      $scope.actionName = '移动'
      $scope.nameAction = actionName => {
        $scope.actionName = actionName
      }

      $scope.namingDirKeyPress = (e) => {
        if (e.keyCode === 13 && explorer.newDirName) {
          explorer.saveDir(explorer.newDirName)
        }
      }

      // RENAME
      $scope.newName = ''

      $scope.submit = (type, edit) => {
        const data = {
          type: type,
          original: $scope.original
        }
        if (!edit) {
          switch (type) {
          case 'MOVE':
            if (explorer.path.length < ['ONEPIECE', 'LESSON_TYPE'].length) {
              toast.show('无法移动到目标路径', 'warning')
              return
            } else {
              data.edit = explorer.path.slice(1).concat([target]).map(cur => cur.name).join('/')
            }
            break
          case 'TRASH':
            data.edit = '-'
            break
          case 'RENAME':
            data.edit = $scope.newName
            break
          default:
            return
          }
        } else {
          data.edit = edit
        }
        toast.show('正在提交')
        $scope.sendEditsState = $scope.states[1]
        Edit.save(
          data,
          response => {
            $scope.sendEditsState = $scope.states[0]
            if (response['res_code'] === 0) {
              getEdit()
              toast.show(response['msg'] + '，正在刷新文件目录…')
              indexLoader.load()
              if (response['data'] && response['data']['executed'] === true) popper.hide()
            } else {
              toast.show(response['msg'], 'error')
            }
          },
          () => {
            $scope.sendEditsState = $scope.states[0]
            toast.show('无法连接到服务器', 'error')
          })
      }
    })
