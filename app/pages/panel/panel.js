angular.module('onepiece')
  .component('onepiecePanel', {
    template: `
      <div class="fill-height" layout="column">
        <div class="top-banner md-whiteframe-3dp light-background-color left-offset-10" layout
            layout-align="space-between center" layout-wrap>
          <md-button class="back-btn md-fab md-mini background-blue" ng-click="explorer.goBack(1)"
                    ng-class="explorer.path.length>1 ? 'active':'hidden'">
            <md-icon class="material-icons color-white adjust-icon-top-margin-up-3">chevron_left</md-icon>
          </md-button>
          <div layout layout-align="end center">
            <search></search>
            <mobile-menu ng-if="isMobile" funcs="topFuncs">
            </mobile-menu>
            <normal-menu ng-if="!isMobile" funcs="topFuncs">
            </normal-menu>
          </div>
        </div>
        <div class="protect-overflow">
          <md-list class="no-padding-top">
            <md-subheader class="md-no-sticky lesson-route-header">
              <span class="lesson-route" ng-click="explorer.goBack(explorer.path.length - 1)">
                <b>ONEPIECE</b>
              </span>
              <span class="lesson-route" ng-repeat="dir in explorer.path" ng-if="!$first"
                    ng-click="explorer.goBack(explorer.path.length - $index - 1)">
                > <b>{{dir.name}}</b>
              </span>
            </md-subheader>
            <md-divider></md-divider>
            <item ng-repeat="content in explorer.path[explorer.path.length - 1].content" content="content"></item>
          </md-list>
        </div>
      </div>
    `,
    controller: function ($scope, $mdDialog, $mdMedia, explorer, utility, downloader, showUserCenter) {
      $scope.explorer = explorer;

      $scope.openNestedMenu = function ($mdOpenMenu, $e) {
        $e.stopPropagation();
        $mdOpenMenu($e);
      };
      $scope.showUserCenter = showUserCenter;
      $scope.showFileDetail = function (file, e) {
        $mdDialog.show({
          controller: 'FilePreviewController',
          templateUrl: 'file_preview.html',
          targetEvent: e,
          locals: {
            file: file
          },
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: true
        });
      };
      $scope.showEdit = function (item, e) {
        $mdDialog.show({
          controller: 'EditController',
          templateUrl: 'edit.html',
          targetEvent: e,
          locals: {
            item: item
          },
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: true
        });
      };
      $scope.showLessonPreview = function (lesson, e) {
        $mdDialog.show({
          controller: 'LessonPreviewController',
          templateUrl: 'lesson_preview.html',
          targetEvent: e,
          locals: {
            lesson: lesson
          },
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: true
        });
      };
      $scope.showContribute = function (e) {
        $mdDialog.show({
          // TODO: injections
          controller: 'UploadController',
          templateUrl: 'upload.html',
          targetEvent: e,
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: false,
          locals: {},
          onComplete: function (uploadControllerScope) {
            uploadControllerScope.QUploader = Qiniu.uploader(uploadControllerScope.QUploaderConfig);
          }
        });
      };
      $scope.showRanking = function (e) {
        $mdDialog.show({
          controller: 'RankingController',
          templateUrl: 'ranking.html',
          locals: {},
          targetEvent: e,
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: false
        });
      };
      $scope.showAbout = function (e) {
        $mdDialog.show({
          controller: 'AboutController',
          templateUrl: 'about.html',
          targetEvent: e,
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: true
        });
      };


      // top-right menu
      $scope.topFuncs = [
        {
          func: $scope.showUserCenter,
          icon: 'account_circle',
          tip: '用户中心'
        },
        {
          func: $scope.showContribute,
          icon: 'cloud_upload',
          tip: '上传资料'
        },
        {
          func: $scope.showRanking,
          icon: 'format_list_numbered',
          tip: '贡献度排行'
        },
        {
          func: $scope.showAbout,
          icon: 'info_outline',
          tip: '关于本站'
        }
      ];
      $scope.isMobile = utility.isMobile();
      $scope.delay = $scope.isMobile ? 0 : 300;
    }
  });