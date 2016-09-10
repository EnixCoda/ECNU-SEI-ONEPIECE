angular.module('onepiece')
  .factory('explorer',
    function ($timeout, $location, popper, toast) {
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

      function generatePathURIArr () {
        return explorer.path.slice(1).concat(explorer.focusedFile ? [explorer.focusedFile]:[]).map(function (cur) {
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
        $location.path('/').replace();

        if (!localStorage.getItem('notFirstTime')) {
          localStorage.setItem('notFirstTime', 'yes');
          toast.show('初次访问?正在为你读取使用帮助...');
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
              // user-triggered
              $timeout(function () {
                explorer.path.push(target);
                explorer.disableGoTo = false;
              }, 200); // TODO
            } else {
              explorer.path.push(target);
              explorer.disableGoTo = false;
            }
          } else {
            savePathToStorage();
            explorer.focusedFile = target;
            $timeout(function () {
              popper.showFileDetail(target, e);
            }, 0);
          }
          savePathToStorage();
        }
      };

      explorer.goBack = function (step) {
        if (explorer.path.length === 1) return false;
        step = step || 1;
        explorer.path.splice(Math.max(explorer.path.length - step, 1));
        savePathToStorage();
        explorer.focusedFile = null;
        return true;
      };

      explorer.getShareLink = function () {
        return $location.protocol() + '://' + $location.host() + ($location.port() === 80 ? '' : ':' + $location.port()) + '/#/' + generatePathURIArr().join('/');
      };

      return explorer;
    });
