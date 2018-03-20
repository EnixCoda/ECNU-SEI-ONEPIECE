angular.module('onepiece')
  .factory('indexLoader',
    ($resource, $timeout, lessonLoader, explorer, toast) => {
      const Index = $resource('index', {}, {})

      const success = (data) => {
        indexLoader.index = data
        lessonLoader.parse(indexLoader.index)
        explorer.setIndex(indexLoader.index)
        $timeout(() => {
          indexLoader.state = indexLoader.states[1]
        }, 400)
      }

      const fail = () => {
        indexLoader.state = indexLoader.states[2]
      }

      const indexLoader = {}
      indexLoader.states = ['LOADING', 'SUCCESS', 'FAILED']
      indexLoader.state = indexLoader.states[0]
      indexLoader.index = []
      indexLoader.load = () => {
        Index.get(
          {},
          (response) => {
            if (response['res_code'] === 0) {
              const indexData = response['data']['index']
              success(indexData)
              try {
                localStorage.setItem('index', JSON.stringify(indexData))
              } catch (err) {}
            } else {
              fail()
            }
          },
          () => {
            try {
              const cachedIndex = localStorage.getItem('index')
              if (cachedIndex) {
                success(JSON.parse(cachedIndex))
                toast.show('更新目录失败，正在使用本地副本', 'warning')
              } else {
                fail()
              }
            } catch (err) {
              fail()
            }
          })
      }

      return indexLoader
    })
