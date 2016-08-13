/**
 * Created by exincoda on 16/8/13.
 */

angular.module('onepiece')
  .factory('downloader',
    function ($http, user) {
      'use strict';
      var Downloader = {};
      Downloader.downloadFile = function (file, toastBound) {
        if (file.gettingDownloadLink) return;
        file.gettingDownloadLink = true;
        var data = {};
        if (user.status == 'ONLINE') {
          data.token = user.token;
        }
        $http.get(['file', file.id.toString(), 'download'].join('/'), {
          params: data
        })
          .then(function (response) {
            file.gettingDownloadLink = false;
            var responseData = response.data;
            if (responseData['res_code'] === 0) {
              window.open(responseData['data']['downloadLink']);
            } else {
              // toast.show(responseData['msg'], toastBound, 'error');
            }
          }, function () {
            file.gettingDownloadLink = false;
            // toast.show('无法连接到服务器', toastBound, 'error')
          });
      };
      Downloader.previewFile = function (file, toastBound) {
        if (file.gettingPreviewLink) return;
        file.gettingPreviewLink = true;
        var data = {};
        if (user.status == 'ONLINE') {
          data.token = user.token;
        }
        $http.get(['file', file.id.toString(), 'preview'].join('/'), {
          params: data
        })
          .then(function (response) {
            file.gettingPreviewLink = false;
            var responseData = response.data;
            if (responseData['res_code'] === 0) {
              window.open(responseData['data']['previewLink'], '_blank');
            } else {
              // toast.show(responseData['msg'], toastBound, 'error');
            }
          }, function () {
            file.gettingPreviewLink = false;
            // toast.show('无法连接到服务器', toastBound, 'error')
          });
      };
      Downloader.downloadLesson = function (lesson, toastBound) {
        if (!user.token) return;
        var data = {
          token: user.token
        };
        $http.get(['lesson', lesson.name, 'download'].join('/'), {
          params: data
        })
          .then(function (response) {
              var responseData = response['data'];
              if (responseData['res_code'] == 0) {
                window.open(responseData['data']['link']);
              } else {
                // toast.show(responseData['msg'], toastBound, 'error', false);
              }
            },
            function () {
              // toast.show('下载课程文件失败', toastBound, 'error', false);
            });
      };

      return Downloader;
    });