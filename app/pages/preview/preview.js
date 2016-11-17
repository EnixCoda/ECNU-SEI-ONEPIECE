angular.module('onepiece')
  .controller('PreviewPanelController', 
    function ($scope, $timeout, mdPanelRef, file, downloader, user) {
      $scope.file = file;
      $scope.user = user;

      var p = downloader.previewFile(file);
      if (p) {
        // first time
        p.then(() => {
          fetchPage(file);
        }, () => {
          $scope.close();
        })
      } else {
        // cached
        $timeout(() => {
          if ($scope.overflow()) file.preview.pageNumber--; 
          fetchPage(file);
        }, 0);
      }

      $scope.prevPage = ($e) => {
        if (!file.preview.multiPage) return;
        downloader.previewFilePageUp(file);
        fetchPage(file);
        $e.stopPropagation();
        $e.preventDefault();
      };
      $scope.nextPage = ($e) => {
        if (!file.preview.multiPage) return;
        downloader.previewFilePageDown(file);
        fetchPage(file);
        $e.stopPropagation();
        $e.preventDefault();
      };
      $scope.overflow = () => {
        return file.preview.pageNumber > file.preview.maxPageNumber;
      };
      $scope.lastPage = () => {
        return file.preview.pageNumber === file.preview.maxPageNumber;
      };
      $scope.close = () => {
        this.mdPanelRef.close();
      };

      function paint (rawImage) {
        if (!rawImage) return;
        var arr = new Uint8Array(rawImage);
        var i = 0, chunkSize = 0xffff;
        var raw = '';
        while (i * chunkSize < arr.length) {
          raw += String.fromCharCode.apply(null, arr.subarray(i * chunkSize, ++i * chunkSize));
        }
        var b64 = btoa(raw);
        var dataURL = "data:image/jpeg;base64," + b64;
        var ele = document.querySelector('#file-preview-image');
        if (ele) ele.style.background = `url(${dataURL})`;
      };

      function fetchPage(file) {
        file.preview.complete = false;
        if (file.preview.raws && file.preview.raws[file.preview.pageNumber]) {
          file.preview.complete = true;
          paint(file.preview.raws[file.preview.pageNumber]);
        } else if (file.preview.raw) {
          file.preview.complete = true;
          paint(file.preview.raw);
        } else {
          var fetch = downloader.fetchPreviewPage(file);
          fetch.$promise.then(response => {
            file.preview.complete = true;
            if (file.preview.raws) file.preview.raws[fetch.pageNumber] = response.data;
            else file.preview.raw = response.data;
            if (file.preview.pageNumber === fetch.pageNumber) paint(response.data);
          }, err => {
            if (err.status === 595) {
              file.preview.maxPageNumber = file.preview.pageNumber - 1;
            }
          });
        }
      }
    }
  );