angular.module('onepiece')
  .factory('rate',
    ($resource, toast) => {
      const Rate = $resource('/:type/:key/score', {}, {})

      const rateManager = {}
      rateManager.file = null
      rateManager.set = (file) => {
        rateManager.file = file
        rateManager.file.gettingRate = false
        rateManager.file.score = undefined
        rateManager.key = rateManager.file.id
      }
      rateManager.get = () => {
        rateManager.file.gettingRate = true
        Rate.get({
          type: 'file',
          key: rateManager.file.id
        },
          (response) => {
            rateManager.file.gettingRate = false
            if (response['res_code'] === 0) {
              rateManager.file.score = response['data']['total_score']
            } else {
              rateManager.file.gettingRate = false
              toast.show(response['msg'], 'error')
            }
          },
          () => {
            rateManager.file.gettingRate = false
            toast.show('无法获取评分', 'error')
          })
      }
      rateManager.send = (score) => {
        toast.show('正在提交评分')
        Rate.save({
          type: 'file',
          key: rateManager.file.id
        }, {
          score: score
        },
          (response) => {
            if (response['res_code'] === 0) {
            } else {
              toast.show(response['msg'], 'error')
            }
            rateManager.get()
          },
          () => {
            toast.show('无法连接到服务器', 'error')
          })
      }

      return rateManager
    })
