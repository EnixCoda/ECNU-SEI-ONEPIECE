angular.module('onepiece')
  .factory('downloader',
    function ($resource, $http, user, toast) {
      var DownloadServer = $resource('/:type/:key/:action', {}, {
        downloadFile: {
          method: 'GET'
        },
        previewFile: {
          method: 'GET'
        },
        downloadLesson: {
          method: 'GET'
        }
      });

      var Downloader = {};
      Downloader.downloadFile = function (file) {
        if (file.gettingDownloadLink) return;
        file.gettingDownloadLink = true;
        DownloadServer.downloadFile({
            type: 'file',
            key: file.id.toString(),
            action: 'download'
          },
          function (response) {
            file.gettingDownloadLink = false;
            if (response) {
              window.location = response['data']['downloadLink'];
            } else {
              toast.show(response['msg'], 'error');
            }
          },
          function () {
            file.gettingDownloadLink = false;
            toast.show('无法连接到服务器', 'error')
          });
      };
      Downloader.previewFile = function (file) {
        if (file.gettingPreviewLink || file.preview) return;
        file.gettingPreviewLink = true;
        var data = {};
        return DownloadServer.previewFile({
            type: 'file',
            key: file.id.toString(),
            action: 'preview'
          })
          .$promise
          .then(response => {
            file.gettingPreviewLink = false;
            if (response['res_code'] === 0) {
              file.preview = {
                multiPage: response.data.multiPage,
                previewLink: response.data.previewLink
              };
              if (file.preview.multiPage) {
                file.preview.pageNumber = 1;
                file.preview.raws = [];
              }
            } else {
              toast.show(response['msg'], 'error');
            }
            return null;
          }, () => {
            file.gettingPreviewLink = false;
            toast.show('无法连接到服务器', 'error')
            throw false;
          });
      };
      Downloader.previewFilePageUp = function (file) {
        if (file && file.preview && file.preview.multiPage && file.preview.pageNumber > 0) {
          file.preview.previewLink = file.preview.previewLink.replace(/page_number=\d+/, 'page_number=' + --file.preview.pageNumber); 
        }
      };
      Downloader.previewFilePageDown = function (file) {
        if (file && file.preview && file.preview.multiPage && file.preview.pageNumber < 5) {
          file.preview.previewLink = file.preview.previewLink.replace(/page_number=\d+/, 'page_number=' + ++file.preview.pageNumber);
        }
      };
      Downloader.fetchPreviewPage = (file) => {
        return $http({
          responseType: 'arraybuffer',
          method: 'get',
          url: file.preview.previewLink
        });
      };
      Downloader.downloadLesson = function (lesson) {
        DownloadServer.downloadLesson({
            type: 'lesson',
            key: lesson.name,
            action: 'download'
          },
          function (response) {
            if (response['res_code'] === 0) {
              window.location = response['data']['link'];
            } else {
              toast.show(response['msg'], 'error', false);
            }
          },
          function () {
            toast.show('下载课程文件失败', 'error', false);
          });
      };

      return Downloader;
    });
