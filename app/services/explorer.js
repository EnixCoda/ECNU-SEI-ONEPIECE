angular.module('onepiece')
  .factory('explorer',
    ($timeout, $window, $location, $document, $compile, $rootScope, popper, toast) => {
      const targetInDirectory = (target, dir) => {
        if (dir.content) {
          const i = dir.content.map(cur => cur.name).indexOf(target.name)
          return i > -1 ? i : false
        }
        return false
      }

      const generatePathURIArr = (extra) => {
        return explorer.path
          .slice(1)
          .concat(explorer.focusedFile ? [explorer.focusedFile]:[])
          .concat(extra ? [extra] : [])
          .map(cur => cur.name)
      }
      const savePathToStorage = () => {
        localStorage.setItem('lastPath', JSON.stringify(generatePathURIArr()))
      }

      const loadPath = (rawPath) => {
        if (rawPath) {
          const path = rawPath.map(cur => ({
            name: cur,
            content: []
          }))
          while (path.length) explorer.goTo(path.shift())
          return explorer.peak().name === rawPath.slice(-1)[0] || explorer.focusedFile
        }
      }

      const explorer = {}

      explorer.focusedFile = null

      explorer.peak = () => explorer.path[explorer.path.length - 1]

      explorer.setIndex = (index) => {
        explorer.path = [index]
        explorer.nextDir = undefined
        explorer.newDirName = ''
        explorer.namingDir = false
        explorer.namingDirDepth = 0

        if (!loadPath($location.path().split('/'))) {
          if (!loadPath(JSON.parse(localStorage.getItem('lastPath')))) {
            explorer.goBack(Infinity)
          }
        }
        $location.url('/')

        if (!localStorage.getItem('notFirstTime')) {
          localStorage.setItem('notFirstTime', new Date())
          toast.show('初次访问?正在为你读取使用帮助...', undefined, true)
          $timeout(popper.showAbout, 3000)
        }
      }

      // set the max depth of path
      explorer.cutTail = (depth) => {
        explorer.path.splice(depth + 1)
      }

      explorer.createDir = (depth) => {
        explorer.cutTail(depth - 1)
        explorer.namingDir = true
        explorer.namingDirDepth = depth
      }

      explorer.pushNext = () => {
        if (explorer.nextDir) {
          explorer.path.push(explorer.nextDir)
        }
      }

      explorer.saveDir = (name) => {
        const newDir = {
          name,
          content: []
        }
        explorer.path[explorer.path.length - 1].content.push(newDir)
        explorer.goTo(newDir)
        explorer.cancelCreateDir()
      }

      explorer.cancelCreateDir = () => {
        explorer.namingDirDepth = 0
        explorer.newDirName = ''
        explorer.namingDir = false
        explorer.nextDir = undefined
      }

      explorer.disableGoTo = false // prevent error which occurs when folder double clicked
      explorer.goTo = (target, e) => {
        if (explorer.disableGoTo) return
        const pos = targetInDirectory(target, explorer.peak())
        if (pos !== false) {
          target = explorer.peak().content[pos]
          if (target.content) {
            explorer.disableGoTo = true
            if (e !== undefined) {
              // user-triggered, delay for animation
              $timeout(() => {
                explorer.path.push(target)
                explorer.disableGoTo = false
                savePathToStorage()
              }, 200) // TODO
            } else {
              explorer.path.push(target)
              explorer.disableGoTo = false
              savePathToStorage()
            }
          } else {
            explorer.focusedFile = target
            popper.showFileDetail(target, e)
            savePathToStorage()
          }
        }
      }

      explorer.goBack = (step = 0) => {
        let moved = false
        if (explorer.path.length > 1) {
          explorer.path.splice(Math.max(explorer.path.length - step, 1))
          moved = true
        }
        explorer.focusedFile = null
        savePathToStorage()
        return moved
      }

      explorer.copyShareLink = (extra) => {
        const link = $location.protocol() + '://' + $location.host() + ($location.port() === 80 ? '' : ':' + $location.port()) + '/#/' + generatePathURIArr(extra).join('/')
        const document = $window.document
        const copyElement = angular.element('<span id="ngClipboardCopyId">' + link + '</span>')
        const body = $document.find('body').eq(0)
        body.append($compile(copyElement)($rootScope))

        const ngClipboardElement = angular.element(document.getElementById('ngClipboardCopyId'))
        const range = document.createRange()
        range.selectNode(ngClipboardElement[0])

        $window.getSelection().removeAllRanges()
        $window.getSelection().addRange(range)

        if (document.execCommand('copy')) {
          toast.show('链接已复制,快去粘贴吧!')
        } else {
          $window.prompt("自动复制链接失败,请手动复制", link)
        }
        $window.getSelection().removeAllRanges()
        copyElement.remove()
      }

      explorer.getSliblingFile = (offset) => {
        const currentFolder = explorer.peak()
        const filesInCurrentFolder = currentFolder.content.filter(item => !item.content)
        const focusedFileIndex = filesInCurrentFolder.indexOf(explorer.focusedFile)
        const target = filesInCurrentFolder[focusedFileIndex + offset]
        const targetIsFile = target && !target.content
        explorer.existNextFile = focusedFileIndex + offset + 1 < filesInCurrentFolder.length
        explorer.existPreviousFile = focusedFileIndex + offset > 0
        if (targetIsFile) {
          explorer.focusedFile = target
          return target
        }
      }

      return explorer
    })
