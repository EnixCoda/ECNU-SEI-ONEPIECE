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
        downloader.previewFilePageUp(file);
        fetchPage(file);
        $e.stopPropagation();
        $e.preventDefault();
      };
      $scope.nextPage = ($e) => {
        downloader.previewFilePageDown(file);
        fetchPage(file);
        $e.stopPropagation();
        $e.preventDefault();
      };
      $scope.overflow = () => {
        return file.preview && (file.preview.pageNumber > file.preview.maxPageNumber);
      };
      $scope.lastPage = () => {
        return file.preview && (file.preview.pageNumber === file.preview.maxPageNumber);
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
        document.querySelector('#file-preview-image').src = dataURL;
      };

      function fetchPage(file) {
        file.preview.complete = false;
        if (file.preview && file.preview.raws && file.preview.raws[file.preview.pageNumber]) {
          file.preview.complete = true;
          paint(file.preview.raws[file.preview.pageNumber]);
        } else if (file.preview && file.preview.raw) {
          file.preview.complete = true;
          paint(file.preview.raw);
        } else {
          downloader.fetchPreviewPage(file)
          .then(response => {
            file.preview.complete = true;
            if (file.preview.raws) file.preview.raws[file.preview.pageNumber] = response.data;
            else file.preview.raw = response.data;
            paint(response.data);
          }, err => {
            if (err.status === 595) {
              file.preview.maxPageNumber = file.preview.pageNumber - 1;
            }
          });
        }
      }
    }
  );