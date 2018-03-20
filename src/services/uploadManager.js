angular.module('onepiece')
  .factory('uploadManager',
    () => {
      const uploadManager = {}
      uploadManager.doneFiles = []
      uploadManager.uploadingCount = 0
      return uploadManager
    })