angular.module('onepiece')
  .component('search', {
    template: `
      <div class="lesson-search" ng-if="!isNanoScreen">
        <input type="text" placeholder="搜索课程名" id="lessonSearcherKey" ng-model="lessonSearcherKey"
                ng-change="lessonSearcher.search()" ng-focus="lessonSearcher.active()">
        <div class="search-results">
        </div>
        <md-icon class="material-icons color-gray" ng-click="lessonSearcher.clearKey()">close</md-icon>
      </div>
      `,
    controller: function ($scope, explorer, lessonLoader) {
      $scope.lessonSearcher = {};
      $scope.lessonSearcher.search = function () {
        function listenerGenerator(lesson) {
          return function () {
            $scope.lessonSearcher.goDirectTo(lesson);
            document.querySelector('.lesson-search input').blur();
            $scope.$apply();
          };
        }

        var key = document.getElementById('lessonSearcherKey').value.toLowerCase();
        var results = lessonLoader.lessons.filter(function (lesson) {
          return lesson.name.toLowerCase().indexOf(key) > -1;
        });
        var searchResultsElement = document.querySelector('.search-results');
        searchResultsElement.innerHTML = '';
        results = results.length > 0 ? results : [{name: '找不到课程\'' + key + '\''}];
        for (var i = 0; i < results.length; i++) {
          var searchResultElement = document.createElement('div');
          searchResultElement.classList.add('search-result');
          searchResultElement.innerHTML = results[i].name;
          var lesson = results[i];
          searchResultElement.addEventListener('click', listenerGenerator(lesson));
          searchResultsElement.appendChild(searchResultElement);
        }
      };
      $scope.lessonSearcher.active = function () {
        $scope.lessonSearcher.search();
      };
      $scope.lessonSearcher.clearKey = function () {
        document.getElementById('lessonSearcherKey').value = '';
        $scope.lessonSearcher.search();
      };
      $scope.lessonSearcher.goDirectTo = function (lesson) {
        if (lesson && lesson.path) {
          while (explorer.goBack(1)) {}
          var dummyPath = [].concat(lesson.path);
          while (dummyPath.length > 0) {
            explorer.goTo(dummyPath.shift());
          }
        }
      };
    }
  });