angular.module('onepiece')
  .factory('SJAX', () => {
    const sjax = {}
    sjax.run = (method, url, data, success, fail, error) => {
      const xmlHttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP')
      let postfix = ''
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          if (postfix) postfix += '&'
          else postfix += '?'
          postfix += key + '=' + encodeURIComponent(data[key])
        }
      }
      xmlHttp.open(method, url + postfix, false)
      xmlHttp.setRequestHeader('If-Modified-Since', '0')
      try {
        xmlHttp.send()
        if (xmlHttp.status === 200) {
          return success(xmlHttp.responseText)
        } else {
          return fail()
        }
      } catch (err) {
        return error()
      }
    }
    return sjax
  })
