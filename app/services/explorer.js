angular.module('onepiece')
  .factory('explorer',
    function ($timeout, $location, $document, $compile, $rootScope, popper, toast) {
      function targetInDirectory(target, dir) {
        if (dir.isDir) {
          for (var i = 0; i < dir.content.length; i++) {
            if (dir.content[i].name === target.name) {
              return i;
            }
          }
        }
        return false;
      }

      function generatePathURIArr (extra) {
        return explorer.path
          .slice(1)
          .concat(explorer.focusedFile ? [explorer.focusedFile]:[])
          .concat(extra ? [extra] : [])
          .map(function (cur) {
          return cur.name;
        });
      }

      function savePathToStorage () {
        sessionStorage.setItem('lastPath', JSON.stringify(generatePathURIArr()));
      }

      function loadPath(rawPath) {
        if (rawPath) {
          var path = rawPath.map(function (cur) {
            return {
              name: cur,
              isDir: true
            };
          });
          while (path.length) {
            explorer.goTo(path.shift());
          }
          return explorer.path.slice(-1)[0].name === rawPath.slice(-1)[0] || explorer.focusedFile && explorer.focusedFile.name === rawPath.slice(-1)[0];
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

        if (!loadPath($location.path().split('/')))
          if (!loadPath(JSON.parse(sessionStorage.getItem('lastPath'))))
            explorer.goBack(Infinity);
        $location.url('/');

        if (!localStorage.getItem('notFirstTime')) {
          localStorage.setItem('notFirstTime', 'yes');
          toast.show('初次访问?正在为你读取使用帮助...', undefined, true);
          $timeout(popper.showAbout, 4000);
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
          name: name,
          content: [],
          isDir: true
        };
        if (explorer.path[explorer.path.length - 1] === 0) {
          explorer.path.pop();
        }
        explorer.path[explorer.path.length - 1].content.push(newDir);
        explorer.path.push(newDir);
        explorer.namingDirDepth = 0;
        explorer.newDirName = '';
        explorer.nextDir = undefined;
      };

      explorer.cancelCreateDir = function () {
        if (explorer.namingDir) {
          explorer.namingDirDepth = 0;
          explorer.newDirName = '';
          explorer.namingDir = false;
          explorer.nextDir = undefined;
        }
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

      explorer.goBack = function (step) {
        var moved = false;
        if (explorer.path.length > 1) {
          step = step || 0;
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

        var ngClipboardElement = angular.element(document.getElementById('ngClipboardCopyId'));
        var range = document.createRange();
        range.selectNode(ngClipboardElement[0]);

        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);

        if (document.execCommand('copy')) {
          toast.show('链接已复制,快去粘贴吧!');
        } else {
          window.prompt("自动复制链接失败,请手动复制", link);
        }
        window.getSelection().removeAllRanges();
        copyElement.remove();
      };

      return explorer;
    });
