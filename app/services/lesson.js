angular.module('onepiece')
  .factory('lessonLoader',
    function() {
      var lessonLoader = {
        lessons: []
      };
      lessonLoader.parse = function (index) {
        this.lessons = [];
        var itemLv1, itemLv2;
        for (var i = 0; i < index.content.length; i++) {
          itemLv1 = index.content[i];
          if (!itemLv1.isDir) continue;
          for (var j = 0; j < itemLv1.content.length; j++) {
            itemLv2 = itemLv1.content[j];
            if (itemLv2.isDir) {
              this.lessons.push({
                name: itemLv2.name,
                path: [itemLv1, itemLv2]
              });
              itemLv2.isLesson = true;
            }
          }
        }
      };

      return lessonLoader;
    });