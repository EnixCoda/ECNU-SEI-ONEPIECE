angular.module('onepiece')
  .component('item', {
    template: `
      <md-list-item ng-click="explorer.goTo(content, $event)">
        <div layout layout-align="start center">
          <md-icon class="material-icons" ng-style="getFileColor(content)">
            {{content.isDir ? "folder" : getFileIcon(content)}}
          </md-icon>
          <div class="left-offset-10 file-name-in-list" ng-class="getContentNameStyle(content)">
            <p>{{content.name}}</p>
          </div>
        </div>
        <div flex></div>
        <span>{{!content.isDir && explorer.path.length > 1 && content.score !== 0 ? content.score : ""}}</span>
        <md-button ng-if="!content.isDir && explorer.path.length > 1" class="md-icon-button" ng-click="downloadFile(content)" layout layout-align="center center">
          <md-tooltip md-direction="left">
            {{content.gettingDownloadLink?'正在获取下载链接':formatFileSize(content)}}
          </md-tooltip>
          <div>
            <md-icon ng-show="!content.gettingDownloadLink" class="material-icons adjust-icon-top-margin-up-3 color-primary">file_download
            </md-icon>
          </div>
          <div layout layout-align="center center">
            <md-progress-circular ng-show="content.gettingDownloadLink" class="spinner-primary" md-mode="indeterminate" md-diameter="20">
            </md-progress-circular>
          </div>
        </md-button>
        <md-menu class="no-padding-top no-padding-bottom" ng-if="!content.isDir && explorer.path.length > 2" md-position-mode="target-right target">
          <md-button class="md-icon-button" ng-click="openNestedMenu($mdOpenMenu, $event)" layout-align="center center">
            <md-icon class="material-icons adjust-icon-top-margin-up-3 color-primary">more_vert</md-icon>
          </md-button>
          <md-menu-content width="3">
            <md-menu-item>
              <md-button ng-click="showEdit(content, $event)" ng-disabled="user.status !== 'ONLINE'">
                <md-icon class="material-icons adjust-icon-top-margin-down color-primary">mode_edit</md-icon>
                <div flex></div>
                <p md-menu-align-target>修改文件</p>
              </md-button>
            </md-menu-item>
          </md-menu-content>
        </md-menu>
        <md-menu class="no-padding-top no-padding-bottom" ng-if="content.isDir && explorer.path.length > 1" md-position-mode="target-right target">
          <md-button class="md-icon-button" ng-click="openNestedMenu($mdOpenMenu, $event)" layout-align="center center">
            <md-icon class="material-icons adjust-icon-top-margin-up-3 color-primary">more_vert</md-icon>
          </md-button>
          <md-menu-content width="3">
            <md-menu-item ng-if="content.isLesson">
              <md-button ng-click="showLessonPreview(content, $event)">
                <md-icon class="material-icons adjust-icon-top-margin-down color-primary">feedback</md-icon>
                <div flex></div>
                <p md-menu-align-target>课程评价</p>
              </md-button>
            </md-menu-item>
            <md-menu-item ng-if="content.isLesson">
              <md-button ng-click="downloadLesson(content)" ng-disabled="user.status !== 'ONLINE'">
                <md-icon class="material-icons adjust-icon-top-margin-down color-primary">file_download</md-icon>
                <div flex></div>
                <p md-menu-align-target>打包下载</p>
              </md-button>
            </md-menu-item>
            <md-menu-item>
              <md-button ng-click="showEdit(content, $event)" ng-disabled="user.status !== 'ONLINE'">
                <md-icon class="material-icons adjust-icon-top-margin-down color-primary">mode_edit</md-icon>
                <div flex></div>
                <p md-menu-align-target>修改文件夹</p>
              </md-button>
            </md-menu-item>
          </md-menu-content>
        </md-menu>
        <md-divider></md-divider>
      </md-list-item>
      `,
    controller: function ($scope, user, explorer, downloader, utility, popper) {
      $scope.content = this.content;
      $scope.user = user;
      $scope.explorer = explorer;
      $scope.downloadFile = downloader.downloadFile;
      $scope.downloadLesson = downloader.downloadLesson;
      $scope.getFileColor = utility.getFileColor;
      $scope.getFileIcon = utility.getFileIcon;
      $scope.formatFileSize = utility.formatFileSize;
      $scope.getContentNameStyle = utility.getContentNameStyle;
      $scope.showLessonPreview = popper.showLessonPreview;
      $scope.showEdit = popper.showEdit;
      $scope.openNestedMenu = function ($mdOpenMenu, $e) {
        $e.stopPropagation();
        $mdOpenMenu($e);
      };
    },
    bindings: {
      content: '='
    }
  });
