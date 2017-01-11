angular.module('onepiece')
  .factory('utility',
    () => {
      const Utility = {}
      Utility.config = {
        GOOD_FILE_SCORE: 10,
        BAD_FILE_SCORE: -3
      }
      Utility.getFileColor = (file) => {
        const filename = file.name.toLowerCase()
        if (file.content) return {color: '#00bcd4'}
        if (filename.indexOf('.') > -1 && filename[-1] !== '.') {
          let color
          const fileType = filename.substr(filename.lastIndexOf('.') + 1)
          switch (fileType) {
          case 'jpg':
          case 'jpeg':
          case 'png':
          case 'gif':
            color = '#ff9800'
            break
          case 'doc':
          case 'docx':
          case 'rtf':
            color = '#295598'
            break
          case 'txt':
            color = '#295598'
            break
          case 'ppt':
          case 'pptx':
            color = '#8bc34a'
            break
          case 'pdf':
            color = '#ff5722'
            break
          case 'mp3':
          case 'mp4':
          case 'avi':
          case 'flv':
            color = '#009688'
            break
          default:
            color = '#607d8b'
            break
          }
          return {color: color}
        }
      }
      Utility.getFileIcon = (file) => {
        const filename = file.name.toLowerCase()
        if (filename.indexOf('.') > -1 && filename[-1] !== '.') {
          const fileType = filename.substr(filename.lastIndexOf('.') + 1)
          switch (fileType) {
          case 'jpg':
          case 'jpeg':
          case 'png':
            return 'image'
          case 'gif':
            return 'gif'
          case 'doc':
          case 'docx':
          case 'rtf':
            return 'description'
          case 'txt':
            return 'description'
          case 'ppt':
          case 'pptx':
            return 'slideshow'
          case 'pdf':
            return 'picture_as_pdf'
          case 'mp3':
            return 'mic'
          case 'mp4':
          case 'avi':
          case 'flv':
            return 'movie'
          default:
            return 'attach_file'
          }
        }
        return 'attach_file'
      }
      Utility.previewable = (file) => {
        const filename = file.name.toLowerCase()
        if (filename.indexOf('.') > -1 && filename[-1] !== '.') {
          const fileType = filename.substr(filename.lastIndexOf('.') + 1)
          switch (fileType) {
          case 'jpeg':
          case 'jpg':
          case 'bmp':
          case 'png':
          case 'pdf':
          case 'doc':
          case 'docx':
          case 'ppt':
          case 'pptx':
            return true
          default:
            return false
          }
        }
        return false
      }
      Utility.formatFileSize = (file) => {
        let size = file.size
        if (!size) return
        const measures = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
        let count = 0
        while (size >= 1000) {
          count++
          size *= 0.001
        }
        const sizeToString = size.toString()
        const tail = measures[count]
        const sizeBody = sizeToString.substring(0, sizeToString.indexOf('.') > -1 ? sizeToString.indexOf('.') + 2 : 3)
        return sizeBody + tail
      }
      Utility.getContentNameStyle = (content) => {
        if (content.content) {
          return ''
        } else {
          if (content.score > Utility.config.GOOD_FILE_SCORE) return 'good-file'
          if (content.score < Utility.config.BAD_FILE_SCORE) return 'bad-file'
        }
      }

      return Utility
    })
