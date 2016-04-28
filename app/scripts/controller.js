/**
 * Created by Exin on 2016/3/2.
 */

angular.module("app").controller("controller",
  function ($scope, $http, $mdSidenav, $mdDialog, $timeout, $mdMedia) {

    $scope.user = {};
    loadFromCookie($scope.user);

    function isMobile() {
      var userAgent = navigator.userAgent;
      var isAndroid = userAgent.indexOf("Android") > -1 || userAgent.indexOf("Linux") > -1;
      var isiPhone = userAgent.indexOf("iPhone") > -1;
      var isiPad = userAgent.indexOf("iPad") > -1;
      return isiPad || isiPhone || isAndroid;
    }

    function getWindowSize() {
      var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;
      console.log(x,y);
      return {
        width: x,
        height: y
      };
    }

    $scope.isMobile = isMobile();

    function checkScreenSize() {
      $scope.isNanoScreen = Math.min(getWindowSize().width, getWindowSize().height) < 340;
      console.log($scope.isNanoScreen);
    }
    checkScreenSize();
    window.onresize = checkScreenSize();

    $scope.delay = isMobile() ? 300 : 200;

    $scope.loadingIndex = true;
    $http.get("storage/index.json")
      .then(function (response) {
        $timeout(function () {
          $scope.loadingIndex = false;
          index = response.data[0];
          $scope.directoryStack = [index];
          $scope.currentDirectory = index;
          lessons = getLessonsFrom(index);
        }, 1500);
      }, function () {
        $scope.loadIndexFailed = true;
      });

    var index;
    var lessons;

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

    $scope.goBack = function (step) {
      if ($scope.directoryStack.length == 1) return false;
      if (step >= $scope.directoryStack.length) step = $scope.directoryStack.length - 1;
      for (var i = 0; i < step; i++) {
        $scope.directoryStack.pop();
        setCurrentDirectory();
      }
      return true;
    };

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

    var disableGoTo = false; // prevent error which occurs folder double clicked
    $scope.goTo = function (target, e) {
      function showFileDetail(file, e) {
        $mdDialog.show({
          controller: PreviewController,
          templateUrl: "views/file_preview.html",
          parent: angular.element(document.body),
          targetEvent: e,
          locals: {
            file: file,
            user: $scope.user,
            showUserCenter: $scope.showUserCenter
          },
          fullscreen: $mdMedia('xs'),
          clickOutsideToClose: true
        });
      }

      if (disableGoTo) return;
      var pos = targetInDirectory(target, $scope.currentDirectory);
      if (pos !== false) {
        if (target.isDir) {
          disableGoTo = true;
          $timeout(function () {
            $scope.directoryStack.push(target);
            setCurrentDirectory();
            disableGoTo = false;
          }, $scope.delay);
        } else {
          showFileDetail(target, e);
        }
      }
    };

    function setCurrentDirectory() {
      $scope.currentDirectory = $scope.directoryStack.slice(-1)[0];
    }

    $scope.openNestedMenu = function ($mdOpenMenu, $e) {
      $e.stopPropagation();
      $mdOpenMenu($e);
    };

    $scope.getFileColor = function (file) {
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
    };
    $scope.getFileIcon = function (file) {
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
    };

    $scope.formatFileSize = function (file) {
      var size = file.size;
      if (!size) return;
      var measures = ["", "K", "M", "G", "T", "P"];
      var count = 0;
      while (size >= 1000) {
        count++;
        size *= 0.001;
      }
      var sizeS = "";
      var tail = measures[count] + "B";
      if (count <= 1) {
        sizeS = size.toString().substring(0, size.toString().indexOf("."));
      } else {
        sizeS = size.toString().substring(0, size.toString().indexOf(".") + 3);
      }
      return sizeS + tail;
    };

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
            var pos = targetInDirectory(nextTarget, $scope.currentDirectory);
            if (pos !== false) {
              $scope.directoryStack.push(nextTarget);
              setCurrentDirectory();
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

    $scope.download = function (file) {
      if (file.gettingDownloadLink) return;
      file.gettingDownloadLink = true;
      $http.get("controlCenter/getDownloadLink.php" + "?fileId=" + file.id)
        .then(function (response) {
          if (response.data["res_code"] == 1) {
            console.log(response.data);
            alert("获取下载链接失败!");
          } else {
            file.gettingDownloadLink = false;
            window.location = response.data["downloadLink"];
          }
        });
    };

    $scope.getLessonComments = function () {
    };

    $scope.showUserCenter = function (e) {
      $mdDialog.show({
        controller: UserCenterController,
        templateUrl: "views/user_center.html",
        parent: angular.element(document.body),
        targetEvent: e,
        locals: {
          user: $scope.user
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
        parent: angular.element(document.body),
        targetEvent: e,
        fullscreen: $mdMedia('xs'),
        clickOutsideToClose: true
      });
    };

    $scope.showAbout = function (e) {
      $mdDialog.show({
        controller: AboutController,
        templateUrl: "views/about.html",
        parent: angular.element(document.body),
        targetEvent: e,
        fullscreen: $mdMedia('xs'),
        clickOutsideToClose: true
      });
    };
  });

function PreviewController($scope, $mdDialog, $http, file, user, showUserCenter) {
  $scope.file = file;
  $scope.user = user;
  $scope.showUserCenter = showUserCenter;
  $scope.anonymous = false;

  function getRate() {
    $scope.gettingRate = true;
    $http.post("controlCenter/getRate.php", {
        fileId: file.id
      })
      .then(function (response) {
        $scope.totalScore = response.data["total_score"];
        $scope.gettingRate = false;
      }, function () {
        // TODO: remove after release
        $scope.totalScore = 10;
        $scope.gettingRate = false;
      });
  }

  function getComment() {
    $scope.gettingComment = true;
    $http.post("controlCenter/getComment.php", {
        fileId: file.id
      })
      .then(function (response) {
        $scope.comments = response.data.comments;
        $scope.gettingComment = false;
      }, function () {
        // TODO: remove after release
        $scope.comments = [{comment: "内容测试", username: "用户名测试"},{comment: "内容测试", username: "用户名测试"},{comment: "内容测试", username: "用户名测试"},{comment: "内容测试", username: "用户名测试"},{comment: "内容测试", username: "用户名测试"},{comment: "内容测试", username: "用户名测试"},{comment: "内容测试", username: "用户名测试"}];
        $scope.gettingComment = false;
      });
  }

  getRate();
  getComment();

  $scope.download = function () {
    if (file.gettingDownloadLink) return;
    file.gettingDownloadLink = true;
    var getLinkUrl = "getDownloadLink.php";
    $http.get(getLinkUrl + "?fileId=" + file.id)
      .then(function (response) {
        if (response.data["res_code"] == 1) {
          console.log(response.data);
          alert("获取下载链接失败!");
        } else {
          file.gettingDownloadLink = false;
          window.location = response.data["downloadLink"];
        }
      });
  };

  $scope.formatFileSize = function (file) {
    var size = file.size;
    if (!size) return;
    var measures = ["", "K", "M", "G", "T", "P"];
    var count = 0;
    while (size >= 1000) {
      count++;
      size *= 0.001;
    }
    var sizeS = "";
    var tail = measures[count] + "B";
    if (count <= 1) {
      sizeS = size.toString().substring(0, size.toString().indexOf("."));
    } else {
      sizeS = size.toString().substring(0, size.toString().indexOf(".") + 3);
    }
    return sizeS + tail;
  };

  $scope.rateFile = function (rate) {
    if (angular.isNumber(rate)) {
      $scope.gettingRate = true;
      $http.post("controlCenter/rateFile.php", {
          score: rate,
          fileId: file.id,
          token: user.token
        })
        .then(function () {
          $scope.rated = true;
          getRate();
        });
    }
  };

  $scope.detectCommentLength = function () {
    $scope.comment = $scope.comment.substring(0, 140);
  };

  $scope.sendComment = function () {
    if ($scope.comment) {
      $scope.gettingComment = true;
      $http.post("controlCenter/commentFile.php", {
          username: $scope.anonymous ? "匿名" : $scope.username ? $scope.username : user.name,
          comment: $scope.comment,
          fileId: file.id,
          token: user.token
        })
        .then(function () {
          $scope.comment = "";
          getComment();
        });
    }
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };
}

function UserCenterController($scope, $mdDialog, $http, $mdToast, user) {
  $scope.user = user;

  $scope.keyLogIn = function (e) {
    if (e.keyCode == 13) {
      $scope.logIn();
    }
  };

  $scope.logIn = function () {
    if (!$scope.user.id || !$scope.user.password) return;
    $scope.loggingIn = true;
    $http.post("controlCenter/login.php", user)
      .then(function (response) {
        $scope.loggingIn = false;
        $scope.loginMsg = null;
        var responseData = response.data;
        if (responseData["res_code"] == 0) {
          user.token = responseData.token;
          user.name = responseData.data.username;
          user.cademy = responseData.data.cademy;
          user.loggedIn = true;
          user.password = new Date().getTime().toString().substr(-user.password.length);
          saveToCookie(user);
        } else {
          $scope.loginMsg = responseData.msg;
        }

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

function UploadController($scope, $mdDialog, $http, Upload) {
  $scope.hide = function () {
    $mdDialog.hide();
  };

  $scope.close = function () {
    $mdDialog.cancel();
  };

  $scope.answer = function (answer) {
    $mdDialog.hide(answer);
  };

  $scope.submitNewFileLink = function () {
    if ($scope.link) {
      $scope.submitting = true;
      $scope.submitStatus = "正在提交...";
      $http.post("controlCenter/share.php", $scope.link)
        .then(function () {
          $scope.submitting = false;
          $scope.submitStatus = "提交成功，感谢分享！";
        });
    }
  };

  $scope.uploadFiles = function (file, errFiles) {
    $scope.f = file;
    $scope.errFile = errFiles && errFiles[0];
    if (file) {
      $http.get("controlCenter/getUploadLink.php")
        .then(function (response) {
          var uploadUrl = response.data.uploadLink;
          file.upload = Upload.upload({
            url: uploadUrl,
            wire: file,
            method: 'PUT'
          });

          file.upload.then(function (response) {
            $timeout(function () {
              file.result = response.data;
            });
          }, function (response) {
            if (response.status > 0) {
              $scope.errorMsg = response.status + ': ' + response.data;
            }
          }, function (evt) {
            file.progress = Math.min(100, parseInt(100.0 *
              evt.loaded / evt.total));
          });
        });
    }
  };
}

function AboutController($scope, $mdDialog) {
  $scope.hide = function () {
    $mdDialog.hide();
  };
  $scope.close = function () {
    $mdDialog.cancel();
  };
  $scope.answer = function (answer) {
    $mdDialog.hide(answer);
  };
  $scope.qas = [
    {
      "q": "为什么做这个网站？",
      "a": ["每年学弟学妹找学习资料时都需要向学长学姐寻求帮助，这种“代代相传”的方法是一种不高效的重复劳动。" +
      "每个人的社交圈有限，得到的资料往往不够全面，能够保存、传递给各自学弟学妹的就更少了。许多宝贵的资料就此流失。" +
      "通过这个网站集中传递、保存学习资料就可以避免上述问题。"]
    },
    {
      "q": "通过网站传播习题答案，不怕被校领导查水表吗？",
      "a": ["本站是为了帮助同学们更方便地获取学习资料而建立的。" +
      "提供答案、注解是为了方便做完习题后校对、深入理解。",
        "很多同学都会有这样的经历：做完习题后没有答案校对，等老师批改完再看时，当时的思路和知识点已经记忆模糊，" +
        "由此导致学习效率降低。",
        "此外，对于从本站获取答案进行抄袭、应付了事的部分同学，想必不使用本站也不会独立完成作业。" +
        "因为他们还可以从其他网络资源、甚至同学那里获得答案。"]
    },
    {
      "q": "如何向这个站点提供其他学习资料？",
      "a": ["关闭这个对话框，点击右上角的“我要贡献资源”。"]
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
      "a": ["本站的运营需要少量资金和人力，通过把资料都存放于免费云端存储省去了绝大部分费用，但是管理员等人力还是不可或缺。" +
      "欢迎有志于参与本站管理的同学向当前管理员提交你的申请，一起管理本站。"]
    },
    {
      "q": "那么如何提交申请呢？",
      "a": ["将你的申请文档以“我要贡献资源”内的方式提交即可（仅站长可以查阅）。" +
      "内容包括但不限于你的姓名、院系、年级、班级、网上联络方式。" +
      "加分项：有一定的前端知识储备/脚本语言编程能力。（要求不高）"]
    },
    {
      "q": "站长是谁？",
      "a": ["本站是匿名作品，站长信息保密。"]
    }
    //{
    //  "q": "",
    //  "a": ""
    //},
  ];
}

// ----- cookie code start -----
function setCookie(cookieName, cookieValue, expires) {
  document.cookie = cookieName + "=" + cookieValue + ";path=;expires=" + expires;
}

function clearCookie() {
  var OneMonthAgo = new Date();
  OneMonthAgo.setMonth(OneMonthAgo.getMonth-1);
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
