import angular from 'angular'

export default angular.module('onepiece')
  .factory('cookie',
    () => {
      const CookieManager = {
        loadTokenFromCookie() {
          const rawCookies = document.cookie.split(' ')
          return rawCookies.map(cookie => {
            if (cookie.indexOf('=') > -1) {
              const [key, value] = cookie.split('=')
              if (key === 'token' && value) return value
            }
          }).filter(c => c).pop()
        },
        clearTokenFromCookie() {
          const oneMonthAgo = new Date()
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
          const expire = oneMonthAgo.toUTCString()
          CookieManager.setCookie('token', '', expire)
        },
        setCookie(key, value, expires) {
          document.cookie = [key + '=' + value, 'path=/', expires ? 'expires=' + expires : '', ''].join(';')
        }
      }

      return CookieManager
    })
