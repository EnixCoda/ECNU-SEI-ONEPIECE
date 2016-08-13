/**
 * Created by exincoda on 16/8/13.
 */

angular.module('onepiece')
  .factory('utility',
    function () {
      'use strict';
      var Utility = {};
      Utility.config = {
        GOOD_FILE_SCORE: 10,
        BAD_FILE_SCORE: -3
      };
      Utility.getFileColor = function (file) {
        var filename = file.name.toLowerCase();
        if (file.isDir) return {color: '#00bcd4'};
        if (filename.indexOf('.') > -1 && filename[-1] != '.') {
          var color;
          var fileType = filename.substr(filename.lastIndexOf('.') + 1);
          switch (fileType) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
              color = '#ff9800';
              break;
            case 'doc':
            case 'docx':
            case 'rtf':
              color = '#295598';
              break;
            case 'txt':
              color = '#295598';
              break;
            case 'ppt':
            case 'pptx':
              color = '#8bc34a';
              break;
            case 'pdf':
              color = '#ff5722';
              break;
            case 'mp3':
            case 'mp4':
            case 'avi':
            case 'flv':
              color = '#009688';
              break;
            default:
              color = '#607d8b';
              break;
          }
          return {color: color};
        }
      };
      Utility.getFileIcon = function (file) {
        var filename = file.name.toLowerCase();
        if (filename.indexOf('.') > -1 && filename[-1] != '.') {
          var fileType = filename.substr(filename.lastIndexOf('.') + 1);
          switch (fileType) {
            case 'jpg':
            case 'jpeg':
            case 'png':
              return 'image';
            case 'gif':
              return 'gif';
            case 'doc':
            case 'docx':
            case 'rtf':
              return 'description';
            case 'txt':
              return 'description';
            case 'ppt':
            case 'pptx':
              return 'slideshow';
            case 'pdf':
              return 'picture_as_pdf';
            case 'mp3':
              return 'mic';
            case 'mp4':
            case 'avi':
            case 'flv':
              return 'movie';
            default:
              return 'attach_file';
          }
        }
        return 'attach_file';
      };
      Utility.previewable = function (file) {
        var filename = file.name.toLowerCase();
        if (filename.indexOf('.') > -1 && filename[-1] != '.') {
          var fileType = filename.substr(filename.lastIndexOf('.') + 1);
          switch (fileType) {
            case 'jpg':
            case 'gif':
            case 'bmp':
            case 'png':
            case 'pdf':
            case 'txt':
              return true;
            default:
              return false;
          }
        }
        return false;
      };
      Utility.formatFileSize = function (file) {
        var size = file.size;
        if (!size) return;
        var measures = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
        var count = 0;
        while (size >= 1000) {
          count++;
          size *= 0.001;
        }
        var sizeToString = size.toString();
        var tail = measures[count];
        var sizeBody = sizeToString.substring(0, sizeToString.indexOf('.') > -1 ? sizeToString.indexOf('.') + 2 : 3);
        return sizeBody + tail;
      };
      Utility.isMobile = function () {
        var userAgent = navigator.userAgent;
        var isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Linux') > -1;
        var isiPhone = userAgent.indexOf('iPhone') > -1;
        return isiPhone || isAndroid;
      };
      Utility.getWindowSize = function () {
        var w = window,
          d = document,
          e = d.documentElement,
          g = d.getElementsByTagName('body')[0],
          x = w.innerWidth || e.clientWidth || g.clientWidth,
          y = w.innerHeight || e.clientHeight || g.clientHeight;
        return {
          width: x,
          height: y
        };
      };
      Utility.getContentNameStyle = function (content) {
        if (content.isDir) {
          return '';
        } else {
          if (content.score > Utility.config.GOOD_FILE_SCORE) return 'good-file';
          if (content.score < Utility.config.BAD_FILE_SCORE) return 'bad-file';
        }
      };

      return Utility;
    });