import angular from 'angular'

export default angular.module('onepiece')
  .controller('PreviewPanelController', 
    function($scope, $timeout, mdPanelRef, file, downloader, user) {
      $scope.file = file
      $scope.user = user

      const p = downloader.previewFile(file)
      if (p) {
        // first time
        p.then(() => {
          fetchPage(file)
        }, () => {
          $scope.close()
        })
      } else {
        // cached
        $timeout(() => {
          if ($scope.overflow()) file.preview.pageNumber-- 
          fetchPage(file)
        }, 0)
      }
      $scope.shiftPage = (file, shift) => {
        if (!file.preview.multiPage) return
        downloader.previewFileShiftPage(file, shift)
        fetchPage(file)
      }
      $scope.prevPage = ($e) => {
        $scope.shiftPage(file, -1)
        $e.stopPropagation()
      }
      $scope.nextPage = ($e) => {
        $scope.shiftPage(file, 1)
        $e.stopPropagation()
      }
      $scope.overflow = () => {
        return file.preview.pageNumber > file.preview.maxPageNumber
      }
      $scope.lastPage = () => {
        return file.preview.pageNumber === file.preview.maxPageNumber
      }
      $scope.close = () => {
        this.mdPanelRef.close()
      }

      const parseArrayBuffer = (raw) => {
        const arr = new Uint8Array(raw)
        const chunkSize = 0xffff
        let i = 0, parsed = ''
        while (i * chunkSize < arr.length) {
          parsed += String.fromCharCode.apply(null, arr.subarray(i * chunkSize, ++i * chunkSize))
        }
        return parsed
      }

      const paint = (rawImage) => {
        if (!rawImage) return
        const parsedArrayBuffer = parseArrayBuffer(rawImage)
        const base64Image = btoa(parsedArrayBuffer)
        const dataURL = 'data:image/jpeg;base64,' + base64Image
        const ele = document.querySelector('#file-preview-image')
        if (ele) ele.style.background = `url(${dataURL})`
      }

      const fetchPage = (file) => {
        file.preview.complete = false
        if (file.preview.raws && file.preview.raws[file.preview.pageNumber]) {
          file.preview.complete = true
          paint(file.preview.raws[file.preview.pageNumber])
        } else if (file.preview.raw) {
          file.preview.complete = true
          paint(file.preview.raw)
        } else {
          const {promise, pageNumber} = downloader.fetchPreviewPage(file)
          promise.then(response => {
            file.preview.complete = true
            if (file.preview.raws) file.preview.raws[pageNumber] = response.data
            else file.preview.raw = response.data
            if (file.preview.pageNumber === pageNumber) paint(response.data)
          }, err => {
            if (err.status === 595 || err.status === 400) {
              file.preview.maxPageNumber = pageNumber - 1
            } else {
              file.preview.msg = parseArrayBuffer(err.data)
              file.preview.fail = true
            }
          })
        }
      }
    }
  )