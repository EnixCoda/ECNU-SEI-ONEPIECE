/**
 * Created by Exin on 2016/3/2.
 */

var Utility = {
  getFileColor: function (file) {
    var filename = file.name;
    if (file.isDir) return {color: "#00bcd4"};
    if (filename.indexOf(".") > -1 && filename[-1] != ".") {
      var color;
      var fileType = filename.substr(filename.lastIndexOf(".") + 1);
      switch (fileType) {
        case "jpg":
        case "png":
        case "gif":
          color = "#ff9800";
          break;
        case "doc":
        case "docx":
        case "rtf":
          color = "#295598";
          break;
        case "txt":
          color = "#295598";
          break;
        case "ppt":
        case "pptx":
          color = "#8bc34a";
          break;
        case "pdf":
          color = "#ff5722";
          break;
        case "mp3":
        case "mp4":
        case "avi":
        case "flv":
          color = "#009688";
          break;
        default:
          color = "#607d8b";
          break;
      }
      return {color: color};
    }
  },
  getFileIcon: function (file) {
    var filename = file.name;
    if (filename.indexOf(".") > -1 && filename[-1] != ".") {
      var fileType = filename.substr(filename.lastIndexOf(".") + 1);
      switch (fileType) {
        case "jpg":
        case "png":
          return "image";
        case "gif":
          return "gif";
        case "doc":
        case "docx":
        case "rtf":
          return "description";
        case "txt":
          return "description";
        case "ppt":
        case "pptx":
          return "slideshow";
        case "pdf":
          return "picture_as_pdf";
        case "mp3":
          return "mic";
        case "mp4":
        case "avi":
        case "flv":
          return "movie";
        default:
          return "attach_file";
      }
    }
    return "attach_file";
  },
  formatFileSize: function (file) {
    var size = file.size;
    if (!size) return;
    var measures = ["B", "KB", "MB", "GB", "TB", "PB"];
    var count = 0;
    while (size >= 1000) {
      count++;
      size *= 0.001;
    }
    var sizeToString = size.toString();
    var tail = measures[count];
    var sizeBody = sizeToString.substring(0, sizeToString.indexOf(".") > -1 ? sizeToString.indexOf(".") + 2 : 3);
    return sizeBody + tail;
  },
  previewable: function (file) {
    var filename = file.name;
    switch (filename) {
      case "jpg":
      case "png":
      case "gif":
        return true;
      default:
        return false;
    }
  },
  isMobile: function () {
    var userAgent = navigator.userAgent;
    var isAndroid = userAgent.indexOf("Android") > -1 || userAgent.indexOf("Linux") > -1;
    var isiPhone = userAgent.indexOf("iPhone") > -1;
    return isiPhone || isAndroid;
  },
  getWindowSize: function () {
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
  }
};

angular.module("app").controller("controller",
  function ($scope, $http, $mdSidenav, $mdDialog, $timeout, $mdMedia, $mdToast, $document) {

    function checkScreenSize() {
      $scope.isNanoScreen = Math.min(Utility.getWindowSize().width, Utility.getWindowSize().height) < 340;
      if ($scope.isNanoScreen) {
        alert("检测到当前设备屏幕较小，已为您隐藏返回按钮。想要返回上级目录请点击当前路径中的文件夹名。点击“ONEPIECE”即可回到根目录。");
      }
    }

    function showToast(text, parentId, type, stayLong) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(text)
          .position("top right")
          .parent($document[0].querySelector(parentId ? '#' + parentId : ''))
          .theme(type + "-toast")
          .hideDelay(stayLong ? 4500 : 1500)
      );
    }

    function download(file, toastBounds) {
      if (file.gettingDownloadLink) return;
      file.gettingDownloadLink = true;
      var data = {
        fileId: file.id.toString(),
        filename: file.name.toString(),
        path: $scope.directoryStack.map(
          function (curDir, index) {
            if (index > 0) return curDir.name;
          }).join("/") + "/"
      };
      if ($scope.user.loggedIn) {
        data.token = $scope.user.token;
      }
      $http.post("controlCenter/getDownloadLink.php", data)
        .then(function (response) {
          file.gettingDownloadLink = false;
          var responseData = response.data;
          if (responseData["res_code"] === 0) {
            window.open(responseData["data"]["downloadLink"]);
          } else {
            showToast(responseData["msg"], toastBounds, "error");
          }
        }, function () {
          file.gettingDownloadLink = false;
          showToast("无法连接到服务器", toastBounds, "error")
        });
    }

    function getIndex() {
      $scope.loadingIndex = true;
      var data = {};
      if ($scope.user.token) data.token = $scope.user.token;
      $http.post("controlCenter/getIndex.php", data)
        .then(function (response) {
          var responseData = response.data;
          if (responseData["res_code"] === 0) {
            $scope.loadingIndex = false;
            index = responseData["data"]["index"];
            $scope.directoryStack = [index];
            lessons = getLessonsFrom(index);
          } else {
            $scope.loadIndexFailed = true;
          }
        }, function () {
          $http.get("storage/index.json")
            .then(function (response) {
              var responseData = response.data;
              $timeout(function () {
                $scope.loadingIndex = false;
                index = responseData;
                $scope.directoryStack = [index];
                lessons = getLessonsFrom(index);
              }, 1500);
            }, function () {
              $scope.loadIndexFailed = true;
            });
        });
    }

    function getLessonsFrom(index) {
      var lessons = [];
      for (var i = 0; i < index.content.length; i++) {
        var contentI = index.content[i];
        if (!contentI.isDir) continue;
        for (var j = 0; j < contentI.content.length; j++) {
          var contentJ = contentI.content[j];
          if (contentJ.isDir) {
            lessons.push({
              name: contentJ.name,
              path: [contentI, contentJ]
            });
            contentJ.isLesson = true;
          }
        }
      }
      return lessons;
    }

    // guide explorer's way
    function targetInDirectory(target, dir) {
      if (dir.isDir) {
        for (var i = 0; i < dir.content.length; i++) {
          if (dir.content[i].name == target.name) {
            return i;
          }
        }
      }
      return false;
    }

    var disableGoTo = false; // prevent error which occurs when folder double clicked
    $scope.goTo = function (target, e) {
      if (disableGoTo) return;
      var pos = targetInDirectory(target, $scope.directoryStack.slice(-1)[0]);
      if (pos !== false) {
        if (target.isDir) {
          disableGoTo = true;
          $timeout(function () {
            $scope.directoryStack.push(target);
            disableGoTo = false;
          }, $scope.delay);
        } else {
          showFileDetail(target, e);
        }
      }
    };
    $scope.goBack = function (step) {
      if ($scope.directoryStack.length == 1) return false;
      if (step >= $scope.directoryStack.length) step = $scope.directoryStack.length - 1;
      for (var i = 0; i < step; i++) {
        $scope.directoryStack.pop();
      }
      return true;
    };

    // stylish
    $scope.getFileColor = Utility.getFileColor;
    $scope.getFileIcon = Utility.getFileIcon;
    $scope.formatFileSize = Utility.formatFileSize;
    $scope.getContentNameStyle = function (content) {
      if (content.isDir) {
        return "";
      } else {
        if (content.score > 10) return "good-file";
        if (content.score < -2) return "bad-file";
      }
    };

    $scope.openNestedMenu = function ($mdOpenMenu, $e) {
      $e.stopPropagation();
      $mdOpenMenu($e);
    };
    $scope.download = download;
    $scope.downloadLesson = function (lesson) {
      var data = {
        token: $scope.user.token,
        lesson: lesson.name
      };
      $http.post("controlCenter/downloadLesson.php", data)
        .then(function (response) {
            var responseData = response["data"];
            if (responseData["res_code"] == 0) {
              window.open(responseData["data"]["link"]);
            } else {
              showToast(responseData["msg"], "bodyToastBounds", "error", false);
            }
          },
          function () {
            showToast("下载课程文件失败", "bodyToastBounds", "error", false);
          });
    };

    // provide search functionality to auto-complete
    $scope.lessonSearch = {
      querySearch: function (query) {
        function createFilterFor(query) {
          return function filterFn(lesson) {
            return (lesson.name.indexOf(query) > -1);
          };
        }

        return query ? lessons.filter(createFilterFor(query)) : lessons;
      },
      selectedItemChange: function (item) {
        function goDirectTo(target) {
          while ($scope.goBack(1)) {
          }
          var dummyPath = [].concat(target.path);
          while (dummyPath.length > 0) {
            var nextTarget = dummyPath.shift();
            var pos = targetInDirectory(nextTarget, $scope.directoryStack.slice(-1)[0]);
            if (pos !== false) {
              $scope.directoryStack.push(nextTarget);
            } else {
              while ($scope.goBack(1)) {
              }
              console.log("Path Error");
            }
          }
        }

        if (!item) return;
        goDirectTo(item);
      }
    };


    // show dialogs start
    function showFileDetail(file, e) {
      $mdDialog.show({
        controller: FilePreviewController,
        templateUrl: "views/file_preview.html",
        targetEvent: e,
        locals: {
          file: file,
          user: $scope.user,
          showUserCenter: $scope.showUserCenter,
          formatFileSize: $scope.formatFileSize,
          showToast: showToast,
          download: download
        },
        fullscreen: $mdMedia('xs'),
        clickOutsideToClose: true
      });
    }

    $scope.showEdit = function (item, e) {
      $mdDialog.show({
        controller: EditController,
        templateUrl: "views/edit.html",
        targetEvent: e,
        locals: {
          item: item,
          path: $scope.directoryStack,
          user: $scope.user,
          showToast: showToast
        },
        fullscreen: $mdMedia('xs'),
        clickOutsideToClose: true
      });
    };
    $scope.showLessonPreview = function (lesson, e) {
      $mdDialog.show({
        controller: LessonPreviewController,
        templateUrl: "views/lesson_preview.html",
        targetEvent: e,
        locals: {
          lesson: lesson,
          user: $scope.user,
          showUserCenter: $scope.showUserCenter,
          showToast: showToast
        },
        fullscreen: $mdMedia('xs'),
        clickOutsideToClose: true
      });
    };
    $scope.showUserCenter = function (e) {
      $mdDialog.show({
        controller: UserCenterController,
        templateUrl: "views/user_center.html",
        targetEvent: e,
        locals: {
          user: $scope.user,
          showToast: showToast
        },
        fullscreen: $mdMedia('xs'),
        clickOutsideToClose: true
      }).then(function (user) {
        $scope.user = user
      });
    };
    $scope.showContribute = function (e) {
      $mdDialog.show({
        controller: UploadController,
        templateUrl: "views/contribute.html",
        targetEvent: e,
        fullscreen: $mdMedia('xs'),
        clickOutsideToClose: false,
        locals: {
          user: $scope.user,
          showUserCenter: $scope.showUserCenter,
          path: $scope.directoryStack,
          showToast: showToast
        },
        onComplete: function (uploadControllerScope) {
          uploadControllerScope.QUploader = Qiniu.uploader({
            runtimes: 'html5',
            browse_button: 'pickfiles',
            uptoken_url: 'controlCenter/genToken.php',
            get_new_uptoken: true,
            domain: '7xt1vj.com1.z0.glb.clouddn.com',
            // container: document.getElementById('uploadControllerToastBounds'),
            max_file_size: '200mb',
            max_retries: 1,
            chunk_size: '4mb',
            dragdrop: true,
            // auto_start: true,
            init: {
              'FilesAdded': function (up, files) {
                plupload.each(files, function (file) {

                });
                uploadControllerScope.$apply();
              },
              'BeforeUpload': function (up, file) {
                uploadControllerScope.uploadingCount++;
              },
              'UploadProgress': function (up, file) {
                if (!uploadControllerScope.canceling) uploadControllerScope.$apply();
                else uploadControllerScope.canceling = false;
              },
              'FileUploaded': function (up, file, info) {
                info = JSON.parse(info);
                var data = {
                  username: uploadControllerScope.anonymous ? "匿名" : uploadControllerScope.username ? uploadControllerScope.username : uploadControllerScope.user.name,
                  token: uploadControllerScope.user.token,
                  fileId: info["etag"],
                  filePath: info["key"]
                };
                $http.post("controlCenter/contribute.php", data)
                  .then(function (response) {
                  }, function () {
                  });
                up.removeFile(file);
                file.success = true;
                uploadControllerScope.doneFiles.push(file);
                uploadControllerScope.uploadingCount--;
                uploadControllerScope.$apply();
              },
              'Error': function (up, err, errTip) {
                showToast("上传失败! " + err.file.name + ": " + errTip, "uploadControllerToastBounds", "error", true);
                up.removeFile(err.file);
                uploadControllerScope.doneFiles.push(err.file);
                uploadControllerScope.uploadingCount--;
                uploadControllerScope.$apply();
              },
              'UploadComplete': function () {
              },
              'Key': function (up, file) {
                var dirNames = uploadControllerScope.path.slice(1).map(
                  function (curDir) {
                    return curDir.name;
                  }
                );
                var key;
                if (dirNames.length > 0) {
                  key = dirNames.join("/") + "/" + file.name;
                } else {
                  key = file.name;
                }
                return key;
              }
            }
          });
        }
      });
    };
    $scope.showRank = function (e) {
      $mdDialog.show({
        controller: RankingController,
        templateUrl: "views/rank.html",
        locals: {
          user: $scope.user,
          showToast: showToast,
          showUserCenter: $scope.showUserCenter
        },
        targetEvent: e,
        fullscreen: $mdMedia('xs'),
        clickOutsideToClose: false
      });
    };
    $scope.showAbout = function (e) {
      $mdDialog.show({
        controller: AboutController,
        templateUrl: "views/about.html",
        targetEvent: e,
        fullscreen: $mdMedia('xs'),
        clickOutsideToClose: true
      });
    };
    // show dialogs end

    // top right menu's content
    $scope.topFuncs = [
      {
        func: $scope.showUserCenter,
        icon: "account_circle",
        tip: "用户中心"
      },
      {
        func: $scope.showContribute,
        icon: "cloud_upload",
        tip: "上传资料"
      },
      {
        func: $scope.showRank,
        icon: "format_list_numbered",
        tip: "贡献度排行"
      },
      {
        func: $scope.showAbout,
        icon: "info_outline",
        tip: "关于本站"
      }
    ];


    // init
    window.onresize = checkScreenSize();
    var index, lessons;
    $scope.user = {};
    loadFromCookie($scope.user);
    getIndex();
    $scope.isMobile = Utility.isMobile();
    $scope.delay = $scope.isMobile ? 300 : 200;
  });

// ----- other controllers start -----
function EditController($scope, $mdDialog, $http, path, item, user, showToast) {
  $scope.item = item;

  var statuses = ["GETTING", "SUCCESS", "FAIL"];
  $scope.getEditsStatus = 0;

  $http.post("controlCenter/getEdit.php", {
    path: path.map(function (cur) {
      return cur.name;
    }).join("/") + "/" + item.name
  })
    .then(function (response) {
        var responseData = response["data"];
        if (responseData["res_code"] == 0) {
          $scope.edits = responseData["data"]["edits"];
          $scope.getEditsStatus = 1;
        } else {
          showToast(responseData["msg"], "editToastBounds", "error");
          $scope.getEditsStatus = 2;
        }
      },
      function () {
        showToast("无法连接到服务器", "editToastBounds", "error");
        $scope.getEditsStatus = 2;
      });

  $scope.original = [].concat(path).concat([item]).map(function (cur) {
    return cur.name;
  }).slice(1).join("/");

  $scope.actionName = "移动";
  $scope.nameAction = function (actionName) {
    $scope.actionName = actionName;
  };
  
  $scope.newPath = [].concat(path);
  var newPath = $scope.newPath;
  $scope.nextDir = undefined;
  $scope.newDirName = "";
  $scope.namingDirDepth = 0;

  $scope.cutTail = function (depth) {
    while (newPath.length > depth + 1) {
      newPath.pop();
    }
  };

  $scope.createDir = function (depth) {
    while (newPath.length > depth + 1) {
      newPath.pop();
    }
    $scope.namingDirDepth = depth;
  };

  $scope.namingDirKeyPress = function (e) {
    if (e.keyCode == 13 && $scope.newDirName) {
      $scope.saveDir($scope.newDirName);
    }
  };

  $scope.pushNext = function () {
    if ($scope.nextDir) {
      $scope.newPath.push($scope.nextDir);
    }
  };

  $scope.saveDir = function (name) {
    var newDir = {
      name: name,
      content: [],
      isDir: true
    };
    if ($scope.newPath[$scope.newPath.length - 1] === 0) {
      $scope.newPath.pop();
    }
    $scope.newPath[$scope.newPath.length - 1].content.push(newDir);
    $scope.newPath.push(newDir);
    $scope.namingDirDepth = 0;
    $scope.newDirName = "";
    $scope.nextDir = undefined;
  };

  $scope.cancelCreateDir = function () {
    if ($scope.namingDirDepth) {
      $scope.newPath[$scope.namingDirDepth] = $scope.newPath[$scope.namingDirDepth - 1]["content"].map(function (cur) {
        if (cur.isDir) return cur;
      })[0];
      $scope.namingDirDepth = 0;
      $scope.nextDir = undefined;
    }
  };

  // RENAME
  $scope.newName = "";

  $scope.submit = function (type, edit) {
    var data = {
      type: type,
      token: user.token,
      original: $scope.original
    };
    if (!edit) {
      switch (type) {
        case "MOVE":
          if (newPath.length < 3) {
            showToast("无法移动到目标路径", "editToastBounds", "warning");
            return;
          }
          data["edit"] = newPath.map(function (cur) {
            return cur.name;
          }).slice(1).join("/");
          break;
        case "TRASH":
          data["edit"] = "";
          break;
        case "RENAME":
          data["edit"] = [].concat(path).map(function (cur) {
              return cur.name;
            }).slice(1).join("/") + "/" + $scope.newName;
          break;
        default:
          return;
      }
    } else {
      data["edit"] = edit;
    }
    if (data["edit"] == $scope.original) {
      showToast("未作出修改", "editToastBounds", "warning");
      return;
    }
    $http.post("controlCenter/edit.php", data)
      .then(function (response) {
          var responseData = response["data"];
          if (responseData["res_code"] == 0) {
            showToast(responseData["msg"], "editToastBounds", "success")
          } else {
            showToast(responseData["msg"], "editToastBounds", "error");
          }
        },
        function () {
          showToast("无法连接到服务器", "editToastBounds", "error");
        });
  };

  $scope.close = function () {
    $mdDialog.cancel();
  };
}

function FilePreviewController($scope, $mdDialog, $http, file, user, showUserCenter, showToast, download) {
  $scope.file = file;
  $scope.user = user;
  $scope.showUserCenter = showUserCenter;
  $scope.formatFileSize = Utility.formatFileSize;

  function getRate() {
    $scope.gettingRate = true;
    $http.post("controlCenter/getRate.php", {
      fileId: file.id.toString()
    })
      .then(function (response) {
        $scope.gettingRate = false;
        var responseData = response.data;
        if (responseData["res_code"] === 0) {
          $scope.totalScore = responseData["data"]["total_score"];
          file.score = $scope.totalScore;
        } else {
          showToast(responseData["msg"], "filePreviewToastBounds", "error");
        }
      }, function () {
        $scope.gettingRate = false;
        showToast("无法获取评分", "filePreviewToastBounds", "error");
      });
  }

  function getComment() {
    $scope.gettingComment = true;
    $http.post("controlCenter/getComment.php", {
      fileId: file.id.toString()
    })
      .then(function (response) {
        $scope.gettingComment = false;
        var responseData = response.data;
        if (responseData["res_code"] === 0) {
          $scope.comments = responseData["data"]["comments"];
        } else {
          showToast(responseData["msg"], "filePreviewToastBounds", "error");
        }
      }, function () {
        $scope.gettingComment = false;
        showToast("无法获取评论", "filePreviewToastBounds", "error");
      });
  }

  getRate();
  getComment();

  $scope.download = download;

  $scope.rateFile = function (rate) {
    if (angular.isNumber(rate)) {
      showToast("正在提交评分", "filePreviewToastBounds", "success");
      $http.post("controlCenter/rateFile.php", {
        score: rate,
        fileId: file.id.toString(),
        token: user.token
      })
        .then(function (response) {
          var responseData = response.data;
          if (responseData["res_code"] === 0) {
            showToast(responseData["msg"], "filePreviewToastBounds", "success");
          } else {
            showToast(responseData["msg"], "filePreviewToastBounds", "error");
          }
          getRate();
        }, function () {
          showToast("无法连接到服务器", "filePreviewToastBounds", "error");
        });
    }
  };

  $scope.sendComment = function () {
    if ($scope.comment) {
      showToast("正在提交评论", "filePreviewToastBounds", "success");
      $http.post("controlCenter/comment.php", {
        username: $scope.anonymous ? "匿名" : $scope.username ? $scope.username : user.name,
        comment: $scope.comment,
        fileId: file.id.toString(),
        token: user.token,
        type: "file"
      })
        .then(function (response) {
          var responseData = response.data;
          if (responseData["res_code"] === 0) {
            getComment();
            showToast(responseData["msg"], "filePreviewToastBounds", "success");
          } else {
            showToast(responseData["msg"], "filePreviewToastBounds", "error");
          }
        }, function () {
          showToast("无法连接到服务器", "filePreviewToastBounds", "error")
        });
    }
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };
}

function LessonPreviewController($scope, $mdDialog, $http, lesson, user, showUserCenter, showToast) {
  $scope.lesson = lesson;
  $scope.user = user;
  $scope.showUserCenter = showUserCenter;
  $scope.anonymous = false;

  function getComment() {
    $scope.gettingComment = true;
    $http.post("controlCenter/getLessonComment.php", {
      lessonName: lesson.name
    })
      .then(function (response) {
        $scope.gettingComment = false;
        var responseData = response.data;
        if (responseData["res_code"] === 0) {
          $scope.comments = responseData["data"]["comments"];
        } else {
          showToast(responseData["msg"], "lessonPreviewToastBounds", "error");
        }
      }, function () {
        $scope.gettingComment = false;
        showToast("无法获取评论", "lessonPreviewToastBounds", "error");
      });
  }

  getComment();

  $scope.sendComment = function () {
    if ($scope.comment) {
      showToast("正在提交评论", "lessonPreviewToastBounds", "success");
      $http.post("controlCenter/comment.php", {
        username: $scope.anonymous ? "匿名" : $scope.username ? $scope.username : user.name,
        comment: $scope.comment,
        lessonName: lesson.name,
        token: user.token,
        type: "lesson"
      })
        .then(function (response) {
          var responseData = response.data;
          if (responseData["res_code"] === 0) {
            getComment();
            showToast(responseData["msg"], "lessonPreviewToastBounds", "success");
          } else {
            showToast(responseData["msg"], "lessonPreviewToastBounds", "error");
          }
        }, function () {
          showToast("无法连接到服务器", "lessonPreviewToastBounds", "error");
        });
    }
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };
}

function UserCenterController($scope, $mdDialog, $http, user, showToast) {

  $scope.user = user;

  $scope.keyLogIn = function (e) {
    if (e.keyCode == 13) $scope.logIn();
  };

  $scope.logIn = function () {
    if (!$scope.user.id || !$scope.user.password) return;
    $scope.loggingIn = true;
    $http.post("controlCenter/login.php", user)
      .then(function (response) {
        $scope.loggingIn = false;
        $scope.loginMsg = null;
        var responseData = response.data;
        if (responseData["res_code"] === 0) {
          user.token = responseData["data"]["token"];
          user.name = responseData["data"]["username"];
          user.cademy = responseData["data"]["cademy"];
          user.loggedIn = true;
          user.password = new Date().getTime().toString().substr(-user.password.length);
          showToast("欢迎！" + user.cademy + "的" + user.name, "userCenterToastBounds", "success");
          saveToCookie(user);
        } else {
          $scope.loginMsg = responseData.msg;
        }
      }, function () {
        showToast("无法连接到服务器", "userCenterToastBounds", "error");
      });
  };

  $scope.logOut = function () {
    user.loggedIn = false;
    user.name = null;
    user.token = null;
    user.password = null;
    clearCookie();
  };

  $scope.hide = function () {
    $mdDialog.hide(user);
  };
}

function UploadController($scope, $mdDialog, user, showUserCenter, path, showToast) {

  $scope.user = user;
  $scope.showUserCenter = showUserCenter;
  $scope.path = path;

  $scope.doneFiles = [];

  $scope.nextDir = undefined;
  $scope.newDirName = "";
  $scope.namingDirDepth = 0;
  $scope.uploadingCount = 0;

  $scope.cutTail = function (depth) {
    while (path.length > depth + 1) {
      path.pop();
    }
  };

  $scope.createDir = function (depth) {
    while (path.length > depth + 1) {
      path.pop();
    }
    $scope.namingDirDepth = depth;
  };

  $scope.namingDirKeyPress = function (e) {
    if (e.keyCode == 13 && $scope.newDirName) {
      $scope.saveDir($scope.newDirName);
    }
  };

  $scope.pushNext = function () {
    if ($scope.nextDir) {
      $scope.path.push($scope.nextDir);
    }
  };

  $scope.saveDir = function (name) {
    var newDir = {
      name: name,
      content: [],
      isDir: true
    };
    if ($scope.path[$scope.path.length - 1] === 0) {
      $scope.path.pop();
    }
    $scope.path[$scope.path.length - 1].content.push(newDir);
    $scope.path.push(newDir);
    $scope.namingDirDepth = 0;
    $scope.newDirName = "";
    $scope.nextDir = undefined;
  };

  $scope.cancelCreateDir = function () {
    if ($scope.namingDirDepth) {
      $scope.path[$scope.namingDirDepth] = $scope.path[$scope.namingDirDepth - 1]["content"].map(function (cur) {
        if (cur.isDir) return cur;
      })[0];
      $scope.namingDirDepth = 0;
      $scope.nextDir = undefined;
    }
  };

  $scope.startUpload = function () {
    if ($scope.path.length < 3) {
      showToast("无法上传到当前位置。请选择课程分类、课程名称。", "uploadControllerToastBounds", "warning");
    } else {
      $scope.QUploader.start();
    }
  };

  $scope.cancel = function (file) {
    $scope.uploadingCount--;
    $scope.canceling = true;
    $scope.QUploader.removeFile(file);
    $scope.doneFiles.push(file);
  };

  $scope.close = function () {
    $mdDialog.cancel();
  };
}

function RankingController($scope, $mdDialog, $mdBottomSheet, $document, $http, user, showToast, showUserCenter) {
  $scope.user = user;
  $scope.showUserCenter = showUserCenter;

  $scope.status = "GETTING";
  var data = {};
  if (user.loggedIn) {
    data.token = user.token;
  }
  $http.post("controlCenter/getRank.php", data)
    .then(function (response) {
      var responseData = response.data;
      if (responseData["res_code"] == 0) {
        $scope.rank = responseData["data"]["rank"];
        $scope.userRank = responseData["data"]["userRank"];
        $scope.status = "SUCCESS";
      } else {
        $scope.status = "FAIL";
      }
    }, function () {
      $scope.status = "FAIL";
      showToast("无法获取排行", "rankToastBounds", "error");
    });

  $scope.showRule = function () {
    $mdBottomSheet.show({
      template: '' +
      '<md-bottom-sheet class="md-list md-has-header">' +
      '  <md-list class="no-padding-top">' +
      '    <md-subheader class="md-no-sticky"><h3>计分规则</h3></md-subheader>' +
      '    <md-divider></md-divider>' +
      '    <md-list-item>' +
      '      <div flex="100" layout layout-align="space-between center">' +
      '        <div>上传新文件</div>' +
      '        <div>+10分</div>' +
      '      </div>' +
      '    </md-list-item>' +
      '    <md-list-item>' +
      '      <div flex="100" layout layout-align="space-between center">' +
      '        <div>文件被垃圾回收处理</div>' +
      '        <div>-20分</div>' +
      '      </div>' +
      '    </md-list-item>' +
      '    <md-list-item>' +
      '      <div flex="100" layout layout-align="space-between center">' +
      '        <div>为文件作出评分</div>' +
      '        <div>+1分</div>' +
      '      </div>' +
      '    </md-list-item>' +
      '    <md-list-item>' +
      '      <div flex="100" layout layout-align="space-between center">' +
      '        <div>为文件撰写评价</div>' +
      '        <div>+3分</div>' +
      '      </div>' +
      '    </md-list-item>' +
      '    <md-list-item>' +
      '      <div>' +
      '      *文件的评分将计入其上传者的总分' +
      '      </div>' +
      '    </md-list-item>' +
      '  </md-list>' +
      '  <md-divider></md-divider>' +
      '  <div layout layout-align="end">' +
      '    <md-button class="md-raised" ng-click="close()">关闭</md-button>' +
      '  </div>' +
      '</md-bottom-sheet>' +
      '',
      controller: RuleController,
      clickOutsideToClose: false,
      parent: $document[0].querySelector("#ruleBottomSheetBounds")
    })
  };

  $scope.close = function () {
    $mdDialog.cancel();
  }
}

function RuleController($scope, $mdBottomSheet) {
  $scope.close = function () {
    $mdBottomSheet.hide();
  };
}

function AboutController($scope, $mdDialog) {
  $scope.close = function () {
    $mdDialog.cancel();
  };

  $scope.qas = [
    {
      "q": "如何使用？",
      "a": ["站点内所有资料都可以自由下载、查阅，用于学习用途。",
        "每位登陆成功的同学都可以对站点内的资料/课程进行评分、评论等操作，也可以上传新的资料。",
        "对于需要修整的资料（垃圾文件/过期资料/位置不当的资料），将在多位用户提交相同的修整请求后自动修整。",
        "简而言之，每位用户都可以是本站的使用者、贡献者、管理者。"]
    },
    {
      "q": "为什么做这个网站？",
      "a": ["每年学弟学妹的学习资料都是从学长学姐处转发获得的，次年又转发给各自的学弟学妹。" +
      "这种“代代相传”的方法非常低效。" +
      "加之每个人的社交圈有限，得到的资料往往不够全面，能够保存、传递下去的就更少了。许多优质的资料就此流失。" +
      "通过这个网站集中传递、保存学习资料，可以有效避免上述问题。"]
    },
    {
      "q": "站内资料包括习题答案，不怕被校领导查水表吗？",
      "a": ["本站是为了帮助同学们更方便地获取学习资料而建立的。" +
      "提供答案、注解是为了方便做完习题后校对、深入理解。",
        "很多同学都会有这样的经历：做完习题后没有答案校对，" +
        "等老师批改完再看时，当时的思路和知识点已经记忆模糊，因此学习效率有所降低。",
        "此外，对于从本站获取答案进行抄袭、应付了事的部分同学，想必不使用本站也不会独立完成作业。" +
        "因为他们还可以从其他网络资源、甚至同学那里获得答案。"]
    },
    {
      "q": "如何向这个站点提供学习资料？",
      "a": ["关闭这个对话框，点击右上角的“上传资料”。"]
    },
    {
      "q": "为什么不直接通过一个网盘来传递资料？",
      "a": ["1、大多数网盘目前不支持用户为文件作出评价，而评价是本站的重要功能：" +
      "通过同学们不断地评价、反馈，筛选出站点内优质的资源、淘汰过期或不适宜的资源。",
        "2、以站点的形式存在更易于控制、提供更多功能。",
        "3、站长的个人喜好。"]
    },
    {
      "q": "这个网站如何运营？",
      "a": ["本站的运营需要少量资金和人力，通过把资料都存放于免费云存储省去了绝大部分设备费用，" +
      "同时通过同学们的主动评价自动管理资料，不需要人工管理资料，但还是需要运维人员对站点进行维护。" +
      "欢迎有志于参与本站管理的同学向站长提交你的申请，一起管理本站。" +
      "要求：有基础的前端编程或服务器架设知识。"]
    },
    {
      "q": "如何提交管理申请呢？",
      "a": ["将你的申请文档以“我要贡献资源”内的方式提交，文件名前加上\"申请-\"字样即可（由此仅站长可以查阅申请），比如\"申请-姓名.xxx\"。" +
      "内容包括但不限于你的姓名、院系、年级、班级、联络方式、自我简介。"]
    }
  ];
}
// ----- other controllers end -----


// ----- cookie code start -----
function setCookie(cookieName, cookieValue, expires) {
  document.cookie = cookieName + "=" + cookieValue + ";path=;expires=" + expires;
}

function clearCookie() {
  var OneMonthAgo = new Date();
  OneMonthAgo.setMonth(OneMonthAgo.getMonth() - 1);
  var expire_s = OneMonthAgo.toGMTString();
  setCookie("stuId", "", expire_s);
  setCookie("token", "", expire_s);
  setCookie("cademy", "", expire_s);
  setCookie("name", "", expire_s);
}

function saveToCookie(user) {
  var OneMonthLater = new Date();
  OneMonthLater.setDate(OneMonthLater.getDate() + 30);
  var expire_s = OneMonthLater.toGMTString();
  setCookie("stuId", user.id, expire_s);
  setCookie("token", user.token, expire_s);
  setCookie("cademy", user.cademy, expire_s);
  setCookie("name", user.name, expire_s);
}

function loadFromCookie(user) {
  var cookie_s = document.cookie;
  var cookies = cookie_s.split("; ");
  var count = 0;
  var ESSENTIAL = 4;
  for (var i = 0; i < cookies.length; i++) {
    if (cookies[i].indexOf("=") > -1) {
      var pair = cookies[i].split("=");
      var key = pair[0], value = pair[1];
      if (!key || !value) continue;
      if (key == "stuId") {
        user.id = value;
        count++;
      }
      if (key == "token") {
        user.token = value;
        count++;
      }
      if (key == "cademy") {
        user.cademy = value;
        count++;
      }
      if (key == "name") {
        user.name = value;
        count++;
      }
    }
  }
  if (count == ESSENTIAL) user.loggedIn = true;
}
// ----- cookie code end -----
