angular.module('onepiece')
  .factory('lessonLoader',
    () => {
      const lessonLoader = {
        lessons: []
      }
      lessonLoader.parse = (index) => {
        lessonLoader.lessons = [].concat(...index.content.map(lessonType => {
          const lessons = []
          if (lessonType.content) {
            lessons.push(...lessonType.content.map(lesson => {
              lesson.isLesson = true
              return {
                name: lesson.name,
                path: [lessonType, lesson]
              }
            }))
          }
          return lessons
        }))
      }

      return lessonLoader
    })
