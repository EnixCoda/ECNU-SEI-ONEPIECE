angular.module('onepiece')
  .factory('uploadManager',
    function () {
      var uploadManager = {};
      uploadManager.doneFiles = [];
      uploadManager.uploadingCount = 0;
      return uploadManager;
    });