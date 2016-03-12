/**
 * Created by Exin on 2016/3/2.
 */

angular.module("app").controller("controller", function ($scope, $http, $sce, $mdSidenav, $mdDialog) {

  $http.get("index.json")
    .then(function (response) {
      index = response.data;
      directoryStack = [index];
      $scope.currentPosition = [];
      $scope.currentDirectory = directoryStack[directoryStack.length - 1];
    });

  var index = {
    "name": "",
    "isDir": true,
    "content": []
  };
  var directoryStack = [index];
  $scope.currentPosition = [];
  $scope.currentDirectory = index;

  $scope.goBack = function (step) {
    var last;
    for (var i = 0; i < step; i++) {
      $scope.currentPosition.pop();
      last = directoryStack.pop();
      if (last == index) {
        directoryStack.push(index);
      }
      $scope.currentDirectory = directoryStack[directoryStack.length - 1];
    }
  };

  $scope.goTo = function (target, e) {
    function fileInDirectory(filename, dir) {
      if (dir.isDir) {
        for (var i = 0; i < dir.content.length; i++) {
          if (dir.content[i].name == filename) {
            return i;
          }
        }
      }
      return false;
    }

    var pos = fileInDirectory(target, directoryStack[directoryStack.length - 1]);
    if (pos !== false) {
      if (directoryStack[directoryStack.length - 1].content[pos].isDir) {
        $scope.currentPosition.push(target);
        directoryStack.push(directoryStack[directoryStack.length - 1].content[pos]);
        $scope.currentDirectory = directoryStack[directoryStack.length - 1];
      } else {
        $scope.showDownload(target, e);
      }
    }
  };

  $scope.moreInfo = function(target, $e) {$e.stopPropagation()};

  $scope.showDownload = function (target, e) {
    function setLinkToBaiduYun() {
      $scope.linkToBaiduYun = "http://pan.baidu.com/s/1skhJUFz#path=/ONEPIECE/" +
        encodeURI(
          $scope.currentPosition.length == 0 ? "" : "" + $scope.currentPosition.join("/")
        );
      $scope.linkToBaiduYun = $sce.trustAsResourceUrl($scope.linkToBaiduYun);
    }

    setLinkToBaiduYun();
    $mdDialog.show({
      controller: DownloadController,
      templateUrl: "views/file_preview.html",
      parent: angular.element(document.body),
      targetEvent: e,
      locals: {
        filename: target,
        url: $scope.linkToBaiduYun,
        positionStack: $scope.currentPosition
      },
      clickOutsideToClose: true
    });
  };

  $scope.showContribute = function (e) {
    $mdDialog.show({
      controller: ContributeController,
      templateUrl: "views/contribute.html",
      parent: angular.element(document.body),
      targetEvent: e,
      clickOutsideToClose: true
    });
  };

  $scope.showAbout = function (e) {
    $mdDialog.show({
      controller: AboutController,
      templateUrl: "views/about.html",
      parent: angular.element(document.body),
      targetEvent: e,
      clickOutsideToClose: true
    });
  };
});

function DownloadController($scope, $mdDialog, $http, url, filename, positionStack) {
  function getRates() {
    //var response = JSON.parse('{"rates":[{"comment":"0","score":5},{"comment":"\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528\u597d\u7528","score":5}],"avg_score":5}');
    //$scope.rates = response.rates;
    //$scope.avg_score = response.avg_score;

    $http.post("getRate.php", {
        "filename": filename,
        "positionStack": positionStack
      })
      .then(function (response) {
        $scope.rates = response.data.rates;
        $scope.avg_score = response.data.avg_score;
      });
  }
  getRates();
  $scope.comment = "";
  $scope.score = 5;
  $scope.rateFile = function () {
    if (0 <= $scope.score && $scope.score <= 10) {
      $http.post("rateFile.php", {
          "score": $scope.score,
          "comment": $scope.comment,
          "filename": filename,
          "positionStack": positionStack
        })
        .then(function (response) {
          $scope.rateResponse = "评分已提交！";
          getRates();
        });
    }
  };
  $scope.linkToBaiduYun = url;
  $scope.filename = filename;

  $scope.hide = function () {
    $mdDialog.hide();
  };
  $scope.cancel = function () {
    $mdDialog.cancel();
  };
  $scope.answer = function (answer) {
    $mdDialog.hide(answer);
  };
}

function ContributeController($scope, $mdDialog, $http) {
  $scope.hide = function () {
    $mdDialog.hide();
  };
  $scope.cancel = function () {
    $mdDialog.cancel();
  };
  $scope.answer = function (answer) {
    $mdDialog.hide(answer);
  };

  $scope.submitNewFileLink = function () {
    if ($scope.link) {
      $scope.submitting = true;
      $scope.submitStatus = "正在提交...";
      $http.post("share.php", $scope.link)
        .then(function (response) {
          $scope.submitting = false;
          $scope.submitStatus = "提交成功，感谢分享！";
        });
    }
  }
}

function AboutController($scope, $mdDialog) {
  $scope.hide = function () {
    $mdDialog.hide();
  };
  $scope.cancel = function () {
    $mdDialog.cancel();
  };
  $scope.answer = function (answer) {
    $mdDialog.hide(answer);
  };
  $scope.qas = [
    {
      "q": "为什么做这个网站？",
      "a": "每年学弟学妹找学习资料时都需要向学长学姐寻求帮助，这种“代代相传”是一种不高效的重复劳动。" +
      "加之每个人的社交圈有限，得到的资料往往不够全面，能够保存、传递给各自学弟学妹的就更少了。" +
      "通过这个网站集中传递、保存学习资料就解决了上述问题。"
    },
    {
      "q": "通过网站传播习题答案，不怕被校领导查水表吗？",
      "a": "本站是为了帮助同学们更方便地获取学习资料而建立的。" +
      "提供答案、注解是为了方便做完习题后校对、深入理解。" +
      "举个栗子：很多同学都会有这样的经历，做完习题后没有答案校对，等若干日后老师批改完成再看题目时已经忘了当时的思路和知识点，导致学习效率降低，只恨当时没有答案。" +
      "此外，对于从本站获取答案进行抄袭、应付了事的部分同学，想必不使用本站也不会乖乖独立完成作业。因为他们还可以从其他网络资源、室友处获得答案。"
    },
    {
      "q": "作者是谁？",
      "a": "不告诉你！"
    },
    {
      "q": "如何向这个站点提供其他学习资料？",
      "a": "关闭这个对话框，点击“我要贡献资源”进行了解。"
    },
    {
      "q": "为什么不直接通过一个百度云分享链接来传递资料？",
      "a": "1、百度云分享链接目前不支持用户为文件作出评价，而评价是本站存在的意义之一，通过同学们不断地评价、反馈，筛选出站点内最优质的资源、淘汰过期或不适宜的资源。" +
      "2、以站点的形式存在更有利于本站的持久发展。" +
      "3、资金充裕以后本站可以自建存储，无缝升级。" +
      "4、站长的个人喜好。"
    },
    {
      "q": "这个网站如何运营？",
      "a": "本站的运营需要少量资金和人力，通过把资料都存放于云端存储提供商省去了绝大部分费用，但是管理员等人力还是不可或缺。" +
      "欢迎有志于参与本站管理的同学向当前管理员提交你的申请，一起管理本站。"
    },
    {
      "q": "那么如何提交申请呢？",
      "a": "将你的申请文档以“我要贡献资源”内的方式提交即可。内容包括但不限于你的姓名、院系、年级、班级、网上联络方式。" +
      "加分项：有一定的前端知识储备/脚本语言编程能力。（要求不高）"
    },
    {
      "q": "所以作者到底是谁？",
      "a": "水表已拆，快递不收！"
    },
    //{
    //  "q": "",
    //  "a": ""
    //},
  ];
}