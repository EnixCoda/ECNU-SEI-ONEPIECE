angular.module('onepiece')
  .factory('explorer',
    function ($timeout, popper) {
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

      var explorer = {};
      explorer.setIndex = function (index) {
        explorer.path = [index];
        explorer.nextDir = undefined;
        explorer.newDirName = '';
        explorer.namingDir = false;
        explorer.namingDirDepth = 0;

        // set the max depth of path
        explorer.cutTail = function (depth) {
          explorer.path.splice(depth + 1, Infinity);
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
            explorer.namingDir = false;
            explorer.nextDir = undefined;
          }
        };

        explorer.disableGoTo = false; // prevent error which occurs when folder double clicked
        explorer.goTo = function (target, e) {
          if (explorer.disableGoTo) return;
          var pos = targetInDirectory(target, explorer.path.slice(-1)[0]);
          if (pos !== false) {
            if (target.isDir) {
              explorer.disableGoTo = true;
              if (e !== undefined) {
                $timeout(function () {
                  explorer.path.push(target);
                  explorer.disableGoTo = false;
                }, 200); // TODO
              } else {
                explorer.path.push(target);
                explorer.disableGoTo = false;
              }
            } else {
              popper.showFileDetail(target, e);
            }
          }
        };
        explorer.goBack = function (step) {
          if (explorer.path.length === 1) return false;
          explorer.path.splice(1, step);
          return true;
        };
      };

      return explorer;
    });
