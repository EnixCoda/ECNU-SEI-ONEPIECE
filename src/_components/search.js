import angular from 'angular'

export default angular.module('onepiece')
  .component('search', {
    template: `
      <form ng-submit="$event.preventDefault()">
        <md-autocomplete
          md-search-text-change="searchTextChange(searchText)"
          md-search-text="searchText"
          md-selected-item-change="selectedLessonChange(lesson)"
          md-items="lesson in querySearch(searchText)"
          md-item-text="lesson.name"
          md-min-length="1"
          md-no-cache="true"
          md-select-on-focus="true"
          placeholder="搜索课程">
          <md-item-template>
            <span md-highlight-text="searchText" md-highlight-flags="^i">{{lesson.name}}</span>
          </md-item-template>
          <md-not-found>
            未找到匹配"{{searchText}}"的课程
          </md-not-found>
        </md-autocomplete>
      </form>
    `,
    controller($scope, $log, explorer, lessonLoader) {
      $scope.querySearch = (query) => {
        return query ? lessonLoader.lessons.filter(lesson => {
          return lesson.name.toLowerCase().indexOf(query.toLowerCase()) > -1
        }) : lessonLoader.lessons
      }
      $scope.selectedLessonChange = (lesson) => {
        $scope.goDirectTo(lesson)
      }
      $scope.goDirectTo = (lesson) => {
        if (lesson && lesson.path) {
          explorer.goBack(Infinity)
          const dummyPath = [].concat(lesson.path)
          while (dummyPath.length > 0) {
            explorer.goTo(dummyPath.shift())
          }
        }
      }

      /*
       $scope.searchTextChange = (text) => {
       }
       */
    },
  })
