angular.module('onepiece')
  .factory('indexLoader',
    ($resource, $timeout, lessonLoader, explorer) => {
      const Index = $resource('index', {}, {})

      const success = (data) => {
        indexLoader.index = data
        lessonLoader.parse(indexLoader.index)
        explorer.setIndex(indexLoader.index)
        $timeout(() => {
          indexLoader.status = indexLoader.statuses[1]
        }, 400)
      }

      const fail = () => {
        indexLoader.status = indexLoader.statuses[2]
      }

      // TODO: cache with localStorage and timestamp
      const indexLoader = {}
      indexLoader.statuses = ['LOADING', 'SUCCESS', 'FAILED']
      indexLoader.index = []
      indexLoader.status = indexLoader.statuses[0]
      indexLoader.load = () => {
        Index.get(
          {},
          (response) => {
            if (response['res_code'] === 0) {
              success(response['data']['index'])
            } else {
              fail()
            }
          },
          () => {
            fail()
          })
      }

      return indexLoader
    })
