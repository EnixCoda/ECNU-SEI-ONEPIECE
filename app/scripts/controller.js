/**
 * Created by Exin on 2016/3/2.
 */

// STATIC VALUES
var config = {
  GOOD_FILE_SCORE: 10,
  BAD_FILE_SCORE: -3
};

var User = {
  new: function () {
    var user = {
      id: null,
      token: null,
      cademy: null,
      name: null,
      status: 0
    };
    user.statuses = ["OFFLINE", "CONNECTING", "ONLINE"];
    return user;
  }
};
var user = User.new();

// make mdToast
var Toaster = {
  init: function ($mdToast, $document) {
    Toaster.$mdToast = $mdToast;
    Toaster.$document = $document;
  },
  show: function (text, boundId, type, stayLong) {
    Toaster.$mdToast.show(
      Toaster.$mdToast.simple()
        .textContent(text)
        .position("top right")
        .parent(Toaster.$document[0].querySelector(boundId ? '#' + boundId : ''))
        .theme(type + "-toast")
        .hideDelay(stayLong ? 4500 : 1500)
    );
  }
};

// login, logout, with password or token
var Logger = {
  register: function ($http) {
    Logger.$http = $http;
  },
  logout: function (user) {
    user.status = user.statuses[0];
    clearTokenFromCookie();
  },
  login: function ($scope, user, data) {
    user.status = user.statuses[1];
    Logger.$http.post("login", data)
      .then(function (response) {
        var responseData = response.data;
        if (responseData["res_code"] === 0) {
          user.token = responseData["data"]["token"];
          user.name = responseData["data"]["username"];
          user.cademy = responseData["data"]["cademy"];
          user.status = user.statuses[2];
          saveTokenToCookie(user.token);
        } else {
          user.status = user.statuses[0];
        }
        Toaster.show(responseData["msg"], $scope.toastBound, "success", true);
      }, function () {
        Toaster.show("无法连接到服务器", $scope.toastBound, "error");
      })
  },
  loginWithPassword: function ($scope, user) {
    if (!user || !user.id || !user.password) return;
    var data = {
      id: user.id,
      password: user.password
    };
    Logger.login($scope, user, data);
  },
  loginWithToken: function ($scope, user) {
    if (!user || !user.token) return;
    var data = {
      token: user.token
    };
    Logger.login($scope, user, data);
  }
};

// stylish tools
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
  },
  getContentNameStyle: function (content) {
    if (content.isDir) {
      return "";
    } else {
      if (content.score > config.GOOD_FILE_SCORE) return "good-file";
      if (content.score < config.BAD_FILE_SCORE) return "bad-file";
    }
  }
};

// download file or lesson
var Downloader = {
  register: function ($http, user) {
    Downloader.$http = $http;
    Downloader.user = user;
  },
  downloadFile: function (file, toastBound) {
    if (file.gettingDownloadLink) return;
    file.gettingDownloadLink = true;
    var data = {};
    if (Downloader.user.status == "ONLINE") {
      data.token = Downloader.user.token;
    }
    $http.get(["file", file.id.toString(), "download"].join("/"), {
      params: data
    })
      .then(function (response) {
        file.gettingDownloadLink = false;
        var responseData = response.data;
        if (responseData["res_code"] === 0) {
          window.open(responseData["data"]["downloadLink"]);
        } else {
          Toaster.show(responseData["msg"], toastBound, "error");
        }
      }, function () {
        file.gettingDownloadLink = false;
        Toaster.show("无法连接到服务器", toastBound, "error")
      });
  },
  downloadLesson: function (lesson, toastBound) {
    if (!Downloader.user.token) return;
    var data = {
      token: Downloader.user.token
    };
    $http.get(["lesson", lesson.name, "download"].join("/"), {
      params: data
    })
      .then(function (response) {
          var responseData = response["data"];
          if (responseData["res_code"] == 0) {
            window.open(responseData["data"]["link"]);
          } else {
            Toaster.show(responseData["msg"], toastBound, "error", false);
          }
        },
        function () {
          Toaster.show("下载课程文件失败", toastBound, "error", false);
        });
  }
};

// another explorer
var Explorer = {
  new: function (path) {
    var explorer = {};
    explorer.path = path;
    explorer.nextDir = undefined;
    explorer.newDirName = "";
    explorer.namingDir = false;
    explorer.namingDirDepth = 0;

    // set the max depth of path
    explorer.cutTail = function (depth) {
      while (explorer.path.length > depth + 1) {
        explorer.path.pop();
      }
    };

    explorer.createDir = function (depth) {
      explorer.cutTail(depth - 1);
      explorer.namingDir = true;
      explorer.namingDirDepth = depth;
    };

    explorer.pushNext = function () {
      if (explorer.nextDir) {
        explorer.path.push(explorer.nextDir);
      }
    };

    explorer.saveDir = function (name) {
      var newDir = {
        name: name,
        content: [],
        isDir: true
      };
      if (explorer.path[explorer.path.length - 1] === 0) {
        explorer.path.pop();
      }
      explorer.path[explorer.path.length - 1].content.push(newDir);
      explorer.path.push(newDir);
      explorer.namingDirDepth = 0;
      explorer.newDirName = "";
      explorer.nextDir = undefined;
    };

    explorer.cancelCreateDir = function () {
      if (explorer.namingDir) {
        explorer.namingDirDepth = 0;
        explorer.namingDir = false;
        explorer.nextDir = undefined;
      }
    };

    return explorer;
  }
};

angular.module("app").controller("controller",
  function ($scope, $http, $mdSidenav, $mdDialog, $timeout, $mdMedia, $mdToast, $document) {
    $scope.toastBound = "bodyToastBounds";

    $scope.getFileColor = Utility.getFileColor;
    $scope.getFileIcon = Utility.getFileIcon;
    $scope.formatFileSize = Utility.formatFileSize;
    $scope.getContentNameStyle = Utility.getContentNameStyle;

    $scope.downloadFile = downloadFile;
    $scope.downloadLesson = function (lesson) {
      var data = {
        token: $scope.user.token
      };
      $http.get(["lesson", lesson.name, "download"].join("/"), {
        params: data
      })
        .then(function (response) {
            var responseData = response["data"];
            if (responseData["res_code"] == 0) {
              window.open(responseData["data"]["link"]);
            } else {
              Toaster.show(responseData["msg"], $scope.toastBound, "error", false);
            }
          },
          function () {
            Toaster.show("下载课程文件失败", $scope.toastBound, "error", false);
          });
    };

    function checkNanoScreen() {
      $scope.isNanoScreen = Math.min(Utility.getWindowSize().width, Utility.getWindowSize().height) < 340;
      if ($scope.isNanoScreen) {
        alert("检测到当前设备屏幕较小，已为您隐藏返回按钮。想要返回上级目录请点击当前路径中的文件夹名。点击“ONEPIECE”即可回到根目录。");
      }
    }

    function downloadFile(file, toastBound) {
      if (file.gettingDownloadLink) return;
      file.gettingDownloadLink = true;
      var data = {
        filename: file.name.toString(),
        path: $scope.directoryStack.map(
          function (curDir, index) {
            if (index > 0) return curDir.name;
          }).join("/") + "/"
      };
      if ($scope.user.status == "ONLINE") {
        data.token = $scope.user.token;
      }
      $http.get(["file", file.id.toString(), "download"].join("/"), {
        params: data
      })
        .then(function (response) {
          file.gettingDownloadLink = false;
          var responseData = response.data;
          if (responseData["res_code"] === 0) {
            window.open(responseData["data"]["downloadLink"]);
          } else {
            Toaster.show(responseData["msg"], toastBound, "error");
          }
        }, function () {
          file.gettingDownloadLink = false;
          Toaster.show("无法连接到服务器", toastBound, "error")
        });
    }

    function getIndex() {
      $scope.loadingIndex = true;
      $http.get("index")
        .then(function (response) {
          var responseData = response.data;
          if (responseData["res_code"] === 0) {
            $scope.loadingIndex = false;
            index = responseData["data"]["index"];
            $scope.directoryStack = [index];
            lessons = getLessonsFromIndex(index);
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
                lessons = getLessonsFromIndex(index);
              }, 1500);
            }, function () {
              $scope.loadIndexFailed = true;
            });
        });
    }

    function getLessonsFromIndex(index) {
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

    // explorer start
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
          $scope.showFileDetail(target, e);
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

    // explorer end

    $scope.openNestedMenu = function ($mdOpenMenu, $e) {
      $e.stopPropagation();
      $mdOpenMenu($e);
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
    $scope.showFileDetail = function (file, e) {
      $mdDialog.show({
        controller: FilePreviewController,
        templateUrl: "views/file_preview.html",
        targetEvent: e,
        locals: {
          file: file,
          user: $scope.user,
          showUserCenter: $scope.showUserCenter,
          downloadFile: downloadFile
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
          user: $scope.user,
          path: $scope.directoryStack
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
          showUserCenter: $scope.showUserCenter
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
          user: $scope.user
        },
        fullscreen: $mdMedia('xs'),
        clickOutsideToClose: true
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
          showUserCenter: $scope.showUserCenter,
          user: $scope.user,
          path: $scope.directoryStack
        },
        onComplete: function (uploadControllerScope) {
          uploadControllerScope.QUploader = Qiniu.uploader({
            runtimes: 'html5',
            browse_button: 'pickfiles',
            // uptoken_url: 'uploadToken',
            uptoken_func: function (file) {
              var xmlHttp = {};
              if (window.XMLHttpRequest) {
                xmlHttp = new XMLHttpRequest();
              } else {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
              }
              var url = 'uploadToken'
                + '?token=' + uploadControllerScope.user.token
                + '&key=' + encodeURI(uploadControllerScope.path.slice(1).map(function (cur) {
                  return cur.name;
                }).concat([file.name]).join("/"));
              xmlHttp.open('GET', url, false);
              xmlHttp.setRequestHeader("If-Modified-Since", "0");
              try {
                xmlHttp.send();
                if (xmlHttp.status === 200) {
                  var res = JSON.parse(xmlHttp.responseText);
                  if (res["res_code"] == 0) {
                    file.validToken = true;
                    return res["data"]["uptoken"];
                  } else {
                    Toaster.show(file.name + " 上传失败：" + res["msg"], uploadControllerScope.toastBound, "error", true);
                  }
                } else {
                  Toaster.show("服务器错误", uploadControllerScope.toastBound, "error", true);
                }
              } catch (err) {
                Toaster.show("无法连接到服务器", uploadControllerScope.toastBound, "error", true);
              }
              return "";
            },
            get_new_uptoken: true,
            domain: '7xt1vj.com1.z0.glb.clouddn.com',
            max_file_size: '100mb',
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
                  token: uploadControllerScope.user.token,
                  fileId: info["etag"],
                  filePath: info["key"]
                };
                $http.post("contribute", data)
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
                if (err.file.validToken) {
                  Toaster.show("上传失败! " + err.file.name + ": " + errTip, uploadControllerScope.toastBound, "error", true);
                }
                up.removeFile(err.file);
                uploadControllerScope.doneFiles.push(err.file);
                uploadControllerScope.uploadingCount--;
                uploadControllerScope.$apply();
              },
              'UploadComplete': function () {
              },
              'Key': function (up, file) {
                return uploadControllerScope.path.slice(1).map(
                  function (cur) {
                    return cur.name;
                  }
                ).concat([file.name]).join("/");
              }
            }
          });
        }
      });
    };
    $scope.showRanking = function (e) {
      $mdDialog.show({
        controller: RankingController,
        templateUrl: "views/ranking.html",
        locals: {
          showUserCenter: $scope.showUserCenter,
          user: $scope.user
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

    // top-right menu
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
        func: $scope.showRanking,
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
    var index, lessons;
    checkNanoScreen();
    $scope.isMobile = Utility.isMobile();
    $scope.delay = $scope.isMobile ? 300 : 200;
    getIndex();
    Toaster.init($mdToast, $document);
    Logger.register($http);
    // try log in with saved token
    var token = loadTokenFromCookie();
    if (token) {
      user.token = token;
      Logger.loginWithToken($scope, user);
    }
    Downloader.register($http, user);
    $scope.user = user;
  });

// ----- other controllers start -----
function EditController($scope, $mdDialog, $http, path, item, user) {
  $scope.toastBound = "editToastBounds";

  $scope.item = item;
  $scope.original = [].concat(path).concat([item]).map(function (cur) {
    return cur.name;
  }).slice(1).join("/");

  $scope.statuses = ["STANDBY", "CONNECTING", "SUCCESS", "FAIL"];
  $scope.getEditsStatus = $scope.statuses[0];

  function getEdit() {
    $scope.getEditsStatus = $scope.statuses[1];
    $http.get("edit", {
      params: {
        path: path.slice(1).map(function (cur) {
          return cur.name;
        }).join("/") + "/" + item.name
      }
    })
      .then(function (response) {
          var responseData = response["data"];
          if (responseData["res_code"] == 0) {
            $scope.edits = responseData["data"]["edits"];
            $scope.getEditsStatus = $scope.statuses[2];
          } else {
            Toaster.show(responseData["msg"], $scope.toastBound, "error");
            $scope.getEditsStatus = $scope.statuses[3];
          }
        },
        function () {
          Toaster.show("无法连接到服务器", $scope.toastBound, "error");
          $scope.getEditsStatus = $scope.statuses[3];
        });
  }

  getEdit();

  $scope.actionName = "移动";
  $scope.nameAction = function (actionName) {
    $scope.actionName = actionName;
  };

  $scope.explorer = Explorer.new([].concat(path));

  $scope.namingDirKeyPress = function (e) {
    if (e.keyCode == 13 && $scope.explorer.newDirName) {
      $scope.explorer.saveDir($scope.explorer.newDirName);
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
          if ($scope.explorer.path.length < 3) {
            Toaster.show("无法移动到目标路径", $scope.toastBound, "warning");
            return;
          }
          data["edit"] = $scope.explorer.path.map(function (cur) {
            return cur.name;
          }).slice(1).join("/");
          break;
        case "TRASH":
          data["edit"] = "-";
          break;
        case "RENAME":
          data["edit"] = $scope.newName;
          break;
        default:
          return;
      }
    } else {
      data["edit"] = edit;
    }
    Toaster.show("正在提交", $scope.toastBound, "success");
    $http.post("edit", data)
      .then(function (response) {
          var responseData = response["data"];
          if (responseData["res_code"] == 0) {
            Toaster.show(responseData["msg"], $scope.toastBound, "success");
            getEdit();
          } else {
            Toaster.show(responseData["msg"], $scope.toastBound, "error");
          }
        },
        function () {
          Toaster.show("无法连接到服务器", $scope.toastBound, "error");
        });
  };

  $scope.close = function () {
    $mdDialog.cancel();
  };
}

function FilePreviewController($scope, $mdDialog, $http, file, user, showUserCenter, download) {
  $scope.file = file;
  $scope.user = user;
  $scope.showUserCenter = showUserCenter;
  $scope.formatFileSize = Utility.formatFileSize;

  $scope.toastBound = "filePreviewToastBounds";

  function getRate() {
    $scope.gettingRate = true;
    $http.get(["file", file.id.toString(), "score"].join("/"))
      .then(function (response) {
        $scope.gettingRate = false;
        var responseData = response.data;
        if (responseData["res_code"] === 0) {
          $scope.totalScore = responseData["data"]["total_score"];
          file.score = $scope.totalScore;
        } else {
          Toaster.show(responseData["msg"], $scope.toastBound, "error");
        }
      }, function () {
        $scope.gettingRate = false;
        Toaster.show("无法获取评分", $scope.toastBound, "error");
      });
  }

  function getComment() {
    $scope.gettingComment = true;
    $http.get(["file", file.id.toString(), "comment"].join("/"))
      .then(function (response) {
        $scope.gettingComment = false;
        var responseData = response.data;
        if (responseData["res_code"] === 0) {
          $scope.comments = responseData["data"]["comments"];
        } else {
          Toaster.show(responseData["msg"], $scope.toastBound, "error");
        }
      }, function () {
        $scope.gettingComment = false;
        Toaster.show("无法获取评论", $scope.toastBound, "error");
      });
  }

  getRate();
  getComment();

  $scope.downloadFile = downloadFile;

  $scope.rateFile = function (rate) {
    if (angular.isNumber(rate)) {
      Toaster.show("正在提交评分", $scope.toastBound, "success");
      $http.post(["file", file.id.toString(), "score"].join("/"), {
        score: rate,
        token: user.token
      })
        .then(function (response) {
          var responseData = response.data;
          if (responseData["res_code"] === 0) {
            Toaster.show(responseData["msg"], $scope.toastBound, "success");
          } else {
            Toaster.show(responseData["msg"], $scope.toastBound, "error");
          }
          getRate();
        }, function () {
          Toaster.show("无法连接到服务器", $scope.toastBound, "error");
        });
    }
  };

  $scope.sendComment = function () {
    if ($scope.comment) {
      Toaster.show("正在提交评论", $scope.toastBound, "success");
      $http.post(["file", file.id.toString(), "comment"].join("/"), {
        username: $scope.anonymous ? "匿名" : $scope.username ? $scope.username : user.name,
        comment: $scope.comment,
        token: user.token
      })
        .then(function (response) {
          var responseData = response.data;
          if (responseData["res_code"] === 0) {
            getComment();
            Toaster.show(responseData["msg"], $scope.toastBound, "success");
          } else {
            Toaster.show(responseData["msg"], $scope.toastBound, "error");
          }
        }, function () {
          Toaster.show("无法连接到服务器", $scope.toastBound, "error")
        });
    }
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };
}

function LessonPreviewController($scope, $mdDialog, $http, lesson, user, showUserCenter) {
  $scope.lesson = lesson;
  $scope.user = user;
  $scope.showUserCenter = showUserCenter;
  $scope.anonymous = false;

  $scope.toastBound = "lessonPreviewToastBounds";

  function getComment() {
    $scope.gettingComment = true;
    $http.get(["file", lesson.name, "comment"].join("/"))
      .then(function (response) {
        $scope.gettingComment = false;
        var responseData = response.data;
        if (responseData["res_code"] === 0) {
          $scope.comments = responseData["data"]["comments"];
        } else {
          Toaster.show(responseData["msg"], $scope.toastBound, "error");
        }
      }, function () {
        $scope.gettingComment = false;
        Toaster.show("无法获取评论", $scope.toastBound, "error");
      });
  }

  getComment();

  $scope.sendComment = function () {
    if ($scope.comment) {
      Toaster.show("正在提交评论", $scope.toastBound, "success");
      $http.post(["lesson", lesson.name, "comment"].join("/"), {
        username: $scope.anonymous ? "匿名" : $scope.username ? $scope.username : user.name,
        comment: $scope.comment,
        token: user.token
      })
        .then(function (response) {
          var responseData = response.data;
          if (responseData["res_code"] === 0) {
            getComment();
            Toaster.show(responseData["msg"], $scope.toastBound, "success");
          } else {
            Toaster.show(responseData["msg"], $scope.toastBound, "error");
          }
        }, function () {
          Toaster.show("无法连接到服务器", $scope.toastBound, "error");
        });
    }
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };
}

function UserCenterController($scope, $mdDialog, user) {
  $scope.toastBound = "userCenterToastBounds";
  $scope.user = user;

  $scope.keyLogIn = function (e) {
    if (e.keyCode == 13) $scope.logIn();
  };

  $scope.logIn = function () {
    Logger.loginWithPassword($scope, user);
  };

  $scope.logOut = function () {
    Logger.logout(user);
  };

  $scope.hide = function () {
    $mdDialog.hide(user);
  };
}

function UploadController($scope, $mdDialog, showUserCenter, user, path) {
  $scope.toastBound = "uploadControllerToastBounds";

  $scope.showUserCenter = showUserCenter;
  $scope.user = user;
  $scope.path = path;

  $scope.explorer = Explorer.new(path);

  $scope.namingDirKeyPress = function (e) {
    if (e.keyCode == 13 && $scope.explorer.newDirName) {
      $scope.explorer.saveDir($scope.explorer.newDirName);
    }
  };

  $scope.doneFiles = [];
  $scope.uploadingCount = 0;

  $scope.startUpload = function () {
    if ($scope.explorer.path.length < 3) {
      Toaster.show("无法上传到当前位置。请选择课程分类、课程名称。", $scope.toastBound, "warning");
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

function RankingController($scope, $mdDialog, $mdBottomSheet, $document, $http, user, showUserCenter) {
  $scope.toastBound = "rankingToastBounds";

  $scope.user = user;
  $scope.showUserCenter = showUserCenter;

  $scope.statuses = ["STANDBY", "CONNECTING", "SUCCESS", "FAIL"];

  $scope.status = $scope.statuses[0];

  function getRanking() {
    $scope.status = $scope.statuses[1];
    var data = {};
    if (user.status == "ONLINE") {
      data.token = user.token;
    }
    $http.get("ranking", {
      params: data
    })
      .then(function (response) {
        var responseData = response.data;
        if (responseData["res_code"] == 0) {
          $scope.ranking = responseData["data"]["ranking"];
          $scope.userRanking = responseData["data"]["userRanking"];
          $scope.status = $scope.statuses[2];
        } else {
          $scope.status = $scope.statuses[3];
        }
      }, function () {
        Toaster.show("无法获取排行", $scope.toastBound, "error");
        $scope.status = $scope.statuses[3];
      });
  }

  getRanking();

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
      "q": "如何使用这个网站？",
      "a": [
        "站点内所有资料都可以自由下载、查阅，用于学习用途。",
        "每位登陆的同学都可以对站点内的资料/课程进行评分、评论等操作，也可以上传新的资料、修改已有的资料。",
        "对于需要修整的资料（过期/低质量/位置不当的资料），将在多位用户提交相同的修整请求后自动修整。",
        "每位用户都是本站的使用者、贡献者、管理者。"
      ]
    },
    {
      "q": "做这个网站的目的是什么？",
      "a": [
        "每年学弟学妹的学习资料都是从学长学姐处转发获得的，次年又转发给各自的学弟学妹。" +
        "这种“代代相传”的方法非常低效。" +
        "另外因为每个人的社交圈有限，得到的资料往往不够全面，能够保存、传递下去的更是稀少。许多优质的资料就此流失。" +
        "通过这个网站集中保存、传递学习资料，可以有效避免上述问题。"
      ]
    },
    {
      "q": "为什么不直接使用网盘来传递资料？",
      "a": [
        "大多数网盘目前不支持用户为文件作出评价，而评价是本站的重要功能：" +
        "通过同学们不断地评价、反馈，筛选出站点内优质的资源、淘汰过期或不适宜的资源。" +
        "由此站内资料经过同学们的动态调整，不断获得新资料、淘汰旧资料，将与时俱进、长期为同学们服务。",
        "以站点的形式存在，更易于控制、提供更多功能。"
      ]
    },
    {
      "q": "站内资料包括习题答案，不怕被校领导查水表吗？",
      "a": [
        "本站是为了帮助同学们更方便地获取学习资料而建立的。" +
        "提供答案、注解是为了方便同学们做完习题后校对、深入理解。",
        "很多同学都会有这样的经历：做完习题后没有答案校对，" +
        "等老师批改完再看时，当时的思路和知识点已经记忆模糊，因此学习效率有所降低。",
        "此外，对于从本站获取答案进行抄袭、应付了事的部分同学，想必不使用本站也不会独立完成作业。" +
        "因为他们还可以从其他网络资源、甚至同学那里获得答案。"
      ]
    },
    {
      "q": "如何向这个站点提供学习资料？",
      "a": [
        "关闭这个对话框，点击右上角的“上传资料”。"
      ]
    },
    {
      "q": "这个网站如何运营？",
      "a": [
        "本站的运营需要少量资金和人力，通过把资料都存放于免费云存储省去了绝大部分存储费用，" +
        "同时资料管理依赖于同学们的主动评价，因此不需要人工管理，但是不可避免地需要运维人员对站点进行维护。" +
        "欢迎有志于参与本站管理的同学向站长提交你的申请，一起管理本站。" +
        "简单的要求：具有基础的 前端编程 或 API开发(PHP) 能力。"
      ]
    },
    {
      "q": "如何提交管理申请呢？",
      "a": [
        "将你的申请文档以“我要贡献资源”内的方式提交，文件名前加上\"申请-\"字样即可（比如“申请-张三.pdf”，这样申请就仅对管理员可见了）。" +
        "或者直接发送邮件到 goldroger@163.com。" +
        "内容包括但不限于你的姓名、院系、年级、班级、联络方式、自我简介。"
      ]
    }
  ];
}
// ----- other controllers end -----


// ----- cookie code start -----
function saveTokenToCookie(token) {
  var OneMonthLater = new Date();
  OneMonthLater.setDate(OneMonthLater.getDate() + 30);
  var expire_s = OneMonthLater.toUTCString();
  setCookie("token", token, expire_s);
}

function loadTokenFromCookie() {
  var cookie_s = document.cookie;
  var cookies = cookie_s.split("; ");
  for (var i = 0; i < cookies.length; i++) {
    if (cookies[i].indexOf("=") > -1) {
      var pair = cookies[i].split("=");
      var key = pair[0], value = pair[1];
      if (!key || !value) continue;
      if (key == "token") {
        return value;
      }
    }
  }
  return null;
}

function clearTokenFromCookie() {
  var OneMonthAgo = new Date();
  OneMonthAgo.setMonth(OneMonthAgo.getMonth() - 1);
  var expire_s = OneMonthAgo.toUTCString();
  setCookie("token", "", expire_s);
}

function setCookie(key, value, expires) {
  document.cookie = key + "=" + value + ";path=;expires=" + expires;
}
// ----- cookie code end -----
