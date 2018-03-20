import angular from 'angular'

export default angular.module('onepiece')
  .factory('downloader',
    ($resource, $http, user, toast) => {
      const DownloadServer = $resource('/:type/:key/:action', {}, {
        downloadFile: {
          method: 'GET'
        },
        previewFile: {
          method: 'GET'
        },
        downloadLesson: {
          method: 'GET'
        }
      })

      const Downloader = {}
      Downloader.downloadFile = (file) => {
        if (file.gettingDownloadLink) return
        file.gettingDownloadLink = true
        DownloadServer.downloadFile({
          type: 'file',
          key: file.id.toString(),
          action: 'download'
        },
          (response) => {
            file.gettingDownloadLink = false
            if (response) {
              window.location = response['data']['downloadLink']
            } else {
              toast.show(response['msg'], 'error')
            }
          },
          () => {
            file.gettingDownloadLink = false
            toast.show('无法连接到服务器', 'error')
          })
      }
      Downloader.previewFile = (file) => {
        if (file.gettingPreviewLink || file.preview) return
        file.gettingPreviewLink = true
        file.preview = {} // save some code in other place
        return DownloadServer.previewFile({
          type: 'file',
          key: file.id.toString(),
          action: 'preview'
        }).$promise
          .then(response => {
            file.gettingPreviewLink = false
            if (response['res_code'] === 0) {
              file.preview = {
                multiPage: response.data.multiPage,
                previewLink: response.data.previewLink
              }
              if (file.preview.multiPage) {
                file.preview.pageNumber = 1
                file.preview.raws = []
              }
            } else {
              toast.show(response['msg'], 'error')
            }
          }, () => {
            file.gettingPreviewLink = false
            toast.show('无法连接到服务器', 'error')
            throw false
          })
      }
      Downloader.previewFileShiftPage = (file, shift) => {
        const toPageNumber = file.preview.pageNumber + shift
        if (file.preview.multiPage) {
          if (toPageNumber >= 1 && !(toPageNumber > file.preview.maxPageNumber)) {
            file.preview.pageNumber = toPageNumber
            file.preview.previewLink = file.preview.previewLink.replace(/page_number=\d+/, 'page_number=' + file.preview.pageNumber)
          }
        }
      }
      Downloader.fetchPreviewPage = (file) => ({
        promise: $http({
          responseType: 'arraybuffer',
          method: 'get',
          url: file.preview.previewLink
        }),
        pageNumber: file.preview.pageNumber
      })
      Downloader.downloadLesson = (lesson) => {
        DownloadServer.downloadLesson({
            type: 'lesson',
            key: lesson.name,
            action: 'download'
          },
          (response) => {
            if (response['res_code'] === 0) {
              window.location = response['data']['link']
            } else {
              toast.show(response['msg'], 'error', false)
            }
          },
          () => {
            toast.show('下载课程文件失败', 'error', false)
          }
        )
      }

      return Downloader
    })
