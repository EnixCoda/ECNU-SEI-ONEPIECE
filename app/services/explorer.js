/**
 * Created by exincoda on 16/8/13.
 */

angular.module('onepiece')
  .factory('explorer',
    function () {
      'use strict';
      var explorer = {};
      explorer.setPath = function (path) {
        explorer.path = path;
        explorer.nextDir = undefined;
        explorer.newDirName = '';
        explorer.namingDir = false;
        explorer.namingDirDepth = 0;

        // set the max depth of path
        explorer.cutTail = function (depth) {
          while (explorer.path.length > depth + 1) {
            explorer.path.pop();
          }
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
      };

      return explorer;
    });