angular.module('onepiece')
  .component('dummyExplorer', {
    template: `
      <div layout layout-wrap>
        <md-input-container class="locator-input-container" ng-repeat="dir in explorer.path track by $index" ng-if="$index > 0">
          <md-select aria-label="locator" ng-if="$index === 0" ng-model="dir">
            <md-option ng-value="dir">{{dir.name}}</md-option>
          </md-select>
          <md-select aria-label="locator" ng-if="$index > 0" ng-model="explorer.path[$index]" ng-change="explorer.cutTail($index)">
            <md-option ng-repeat="content in explorer.path[$index - 1].content" ng-if="content.isDir" ng-value="content">
              {{content.name}}
            </md-option>
            <md-option ng-if="$index > 1" ng-click="explorer.createDir($index)" ng-value="0">
              <i>新建文件夹*　</i>
            </md-option>
          </md-select>
        </md-input-container>
        <md-input-container class="locator-input-container" ng-show="!explorer.namingDirDepth" aria-label="locator">
          <md-select aria-label="locator" ng-model="explorer.nextDir" ng-change="explorer.pushNext()">
            <md-option ng-repeat="item in explorer.path[explorer.path.length - 1].content" ng-if="item.isDir" ng-value="item">
              {{item.name}}
            </md-option>
            <md-option ng-if="explorer.path.length > 1" ng-click="explorer.createDir(explorer.path.length)" ng-value="0">
              <i>新建文件夹*　</i>
            </md-option>
          </md-select>
        </md-input-container>
        <md-input-container class="locator-input-container" ng-show="explorer.namingDirDepth" aria-label="locator">
          <label for="newDirName">
            新文件夹名
          </label>
          <input id="newDirName" ng-keypress="namingDirKeyPress($event)" ng-model="explorer.newDirName" ng-pattern='/^[^\\/:?<>*"|]+$/' md-no-asterisk required>
        </md-input-container>
        <md-button ng-show="explorer.newDirName" class="md-fab md-mini background-white" ng-click="explorer.saveDir(explorer.newDirName)">
          <md-icon class="material-icons">done</md-icon>
        </md-button>
        <md-button ng-show="explorer.newDirName" class="md-fab md-mini background-white" ng-click="explorer.cancelCreateDir()">
          <md-icon class="material-icons">clear</md-icon>
        </md-button>
      </div>
    `,
    controller: function ($scope, explorer) {
      $scope.explorer = explorer;
    }
  });