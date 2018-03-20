angular.module('onepiece')
  .factory('user',
    ($http, $timeout, cookie, toast, popper) => {
      const user = {
        cademy: null,
        id: null,
        name: null,
        anonymous: false
      }
      user.states = ['OFFLINE', 'CONNECTING', 'ONLINE']
      user.state = user.states[0]
      user.logOut = () => {
        user.state = user.states[0]
        user.cademy = null
        user.id = null
        user.name = null
        cookie.clearTokenFromCookie()
        toast.show('您已登出')
      }
      user.login = data => {
        user.state = user.states[1]
        $http.post('login', data)
          .then(response => {
            const responseData = response.data
            if (responseData['res_code'] === 0) {
              const userData = responseData['data']
              user.state = user.states[2]
              user.name = userData['username']
              user.alia = userData['alia']
              toast.show(responseData['msg'], 'success', true, 'top left')
              popper.hide('user center')
            } else {
              user.state = user.states[0]
              toast.show(responseData['msg'], 'error', true)
            }
          }, () => {
            user.state = user.states[0]
            toast.show('无法连接到服务器', 'error')
          })
      }
      user.loginWithPassword = () => {
        if (!user.id || !user.password) return
        const data = {
          id: user.id,
          password: user.password
        }
        user.login(data)
      }
      user.loginWithToken = () => {
        const token = cookie.loadTokenFromCookie()
        if (token) {
          user.login()
        }
      }

      return user
    })
