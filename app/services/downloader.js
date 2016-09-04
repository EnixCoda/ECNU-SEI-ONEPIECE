angular.module('onepiece')
  .factory('downloader',
    function ($resource, user, toast) {
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
        if (file.gettingPreviewLink) return;
        file.gettingPreviewLink = true;
        var data = {};
        if (user.status === 'ONLINE') {
          data.token = user.token;
        }
        DownloadServer.previewFile({
            type: 'file',
            key: file.id.toString(),
            action: 'preview'
          },
          function (response) {
            file.gettingPreviewLink = false;
            if (response['res_code'] === 0) {
              var promptedWindow = window.open(response['data']['previewLink'], '_blank');
              if (!promptedWindow) alert('预览窗口加载失败');
            } else {
              toast.show(response['msg'], 'error');
            }
          },
          function () {
            file.gettingPreviewLink = false;
            toast.show('无法连接到服务器', 'error')
          });
      };
      Downloader.downloadLesson = function (lesson) {
        if (!user.token) return;
        DownloadServer.downloadLesson({
            type: 'lesson',
            key: lesson.name,
            action: 'download',
            token: user.token
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
