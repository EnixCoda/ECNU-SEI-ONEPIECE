angular.module('onepiece')
  .component('search', {
    template: `
      <form ng-submit="$event.preventDefault()">
        <md-autocomplete
          md-selected-item="selectedItem"
          md-search-text-change="searchTextChange(searchText)"
          md-search-text="searchText"
          md-selected-item-change="selectedLessonChange(lesson)"
          md-items="lesson in querySearch(searchText)"
          md-item-text="lesson.name"
          md-min-length="0"
          placeholder="搜索课程">
          <md-item-template>
            <span md-highlight-text="searchText" md-highlight-flags="^i">{{lesson.name}}</span>
          </md-item-template>
          <md-not-found>
            未找到"{{searchText}}"有关的课程
          </md-not-found>
        </md-autocomplete>
      </form>
    `,
    controller: function ($scope, $log, explorer, lessonLoader) {

      $scope.querySearch = function (query) {
        function createFilterFor (query) {
          var lowercaseQuery = angular.lowercase(query);
          return function filterFn(lesson) {
            return angular.lowercase(lesson.name).indexOf(lowercaseQuery) > -1;
          };
        }
        return query ? lessonLoader.lessons.filter( createFilterFor(query) ) : lessonLoader.lessons;
      };
      $scope.selectedLessonChange = function (lesson) {
        $scope.goDirectTo(lesson);
      };
      $scope.goDirectTo = function (lesson) {
        if (lesson && lesson.path) {
          explorer.goBack(Infinity);
          var dummyPath = [].concat(lesson.path);
          while (dummyPath.length > 0) {
            explorer.goTo(dummyPath.shift());
          }
        }
      };

      /*
       $scope.searchTextChange = function (text) {
       }
       */
    },
  });
