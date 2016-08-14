/**
 * Created by exincoda on 16/8/13.
 */

angular.module('onepiece')
  .factory('downloader',
    function ($http, user, toast) {
      'use strict';
      var Downloader = {};
      Downloader.downloadFile = function (file) {
        if (file.gettingDownloadLink) return;
        file.gettingDownloadLink = true;
        var data = {};
        if (user.status === 'ONLINE') {
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
              toast.show(responseData['msg'], '', 'error');
            }
          }, function () {
            file.gettingDownloadLink = false;
            toast.show('无法连接到服务器', '', 'error')
          });
      };
      Downloader.previewFile = function (file) {
        if (file.gettingPreviewLink) return;
        file.gettingPreviewLink = true;
        var data = {};
        if (user.status === 'ONLINE') {
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
              toast.show(responseData['msg'], '', 'error');
            }
          }, function () {
            file.gettingPreviewLink = false;
            toast.show('无法连接到服务器', '', 'error')
          });
      };
      Downloader.downloadLesson = function (lesson) {
        if (!user.token) return;
        var data = {
          token: user.token
        };
        $http.get(['lesson', lesson.name, 'download'].join('/'), {
          params: data
        })
          .then(function (response) {
              var responseData = response['data'];
              if (responseData['res_code'] === 0) {
                window.open(responseData['data']['link']);
              } else {
                toast.show(responseData['msg'], '', 'error', false);
              }
            },
            function () {
              toast.show('下载课程文件失败', '', 'error', false);
            });
      };

      return Downloader;
    });