angular.module('onepiece')
  .factory('explorer',
    function ($timeout, $window, $location, $document, $compile, $rootScope, popper, toast) {
      function targetInDirectory(target, dir) {
        if (dir.isDir) {
          let i = dir.content.map(cur => cur.name).indexOf(target.name);
          return i > -1 ? i : false;
        }
        return false;
      }

      function generatePathURIArr (extra) {
        return explorer.path
          .slice(1)
          .concat(explorer.focusedFile ? [explorer.focusedFile]:[])
          .concat(extra ? [extra] : [])
          .map(cur => cur.name);
      }

      function savePathToStorage () {
        sessionStorage.setItem('lastPath', JSON.stringify(generatePathURIArr()));
      }

      function loadPath(rawPath) {
        if (rawPath) {
          var path = rawPath.map(cur => {
            return {
              name: cur,
              isDir: true
            };
          });
          while (path.length) explorer.goTo(path.shift());
          return explorer.path.slice(-1)[0].name === rawPath.slice(-1)[0] || explorer.focusedFile;
        }
      }

      var explorer = {};

      explorer.focusedFile = null;

      explorer.setIndex = function (index) {
        explorer.path = [index];
        explorer.nextDir = undefined;
        explorer.newDirName = '';
        explorer.namingDir = false;
        explorer.namingDirDepth = 0;

        if (!loadPath($location.path().split('/'))) {
          if (!loadPath(JSON.parse(sessionStorage.getItem('lastPath')))) {
            explorer.goBack(Infinity);
          }
        }
        $location.url('/');

        if (!localStorage.getItem('notFirstTime')) {
          localStorage.setItem('notFirstTime', new Date());
          toast.show('初次访问?正在为你读取使用帮助...', undefined, true);
          $timeout(popper.showAbout, 3000);
        }
      };

      // set the max depth of path
      explorer.cutTail = function (depth) {
        explorer.path.splice(depth + 1);
      };

      explorer.createDir = function (depth) {
        explorer.cutTail(depth - 1);
        explorer.namingDir = true;
        explorer.namingDirDepth = depth;
      };

      explorer.pushNext = function () {
        if (explorer.nextDir) {
          explorer.path.push(explorer.nextDir);
        }
      };

      explorer.saveDir = function (name) {
        var newDir = {
          name,
          content: [],
          isDir: true
        };
        explorer.path[explorer.path.length - 1].content.push(newDir);
        explorer.goTo(newDir);
        explorer.cancelCreateDir();
      };

      explorer.cancelCreateDir = function () {
        explorer.namingDirDepth = 0;
        explorer.newDirName = '';
        explorer.namingDir = false;
        explorer.nextDir = undefined;
      };

      explorer.disableGoTo = false; // prevent error which occurs when folder double clicked
      explorer.goTo = function (target, e) {
        if (explorer.disableGoTo) return;
        var pos = targetInDirectory(target, explorer.path.slice(-1)[0]);
        if (pos !== false) {
          target = explorer.path.slice(-1)[0].content[pos];
          if (target.isDir) {
            explorer.disableGoTo = true;
            if (e !== undefined) {
              // user-triggered, delay for animation
              $timeout(function () {
                explorer.path.push(target);
                explorer.disableGoTo = false;
                savePathToStorage();
              }, 200); // TODO
            } else {
              explorer.path.push(target);
              explorer.disableGoTo = false;
              savePathToStorage();
            }
          } else {
            explorer.focusedFile = target;
            popper.showFileDetail(target, e);
            savePathToStorage();
          }
        }
      };

      explorer.goBack = (step = 0) => {
        var moved = false;
        if (explorer.path.length > 1) {
          explorer.path.splice(Math.max(explorer.path.length - step, 1));
          moved = true;
        }
        explorer.focusedFile = null;
        savePathToStorage();
        return moved;
      };

      explorer.copyShareLink = function (extra) {
        var link = $location.protocol() + '://' + $location.host() + ($location.port() === 80 ? '' : ':' + $location.port()) + '/#/' + generatePathURIArr(extra).join('/');
        var copyElement = angular.element('<span id="ngClipboardCopyId">'+link+'</span>');
        var body = $document.find('body').eq(0);
        body.append($compile(copyElement)($rootScope));

        var ngClipboardElement = angular.element($document.getElementById('ngClipboardCopyId'));
        var range = $document.createRange();
        range.selectNode(ngClipboardElement[0]);

        $window.getSelection().removeAllRanges();
        $window.getSelection().addRange(range);

        if ($document.execCommand('copy')) {
          toast.show('链接已复制,快去粘贴吧!');
        } else {
          $window.prompt("自动复制链接失败,请手动复制", link);
        }
        $window.getSelection().removeAllRanges();
        copyElement.remove();
      };

      return explorer;
    });
