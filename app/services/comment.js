angular.module('onepiece')
  .factory('comment',
    function ($resource, toast, user) {
      var Comment = $resource('/:type/:key/comment', {}, {});

      var commentManager = {};
      commentManager.set = function (type, item) {
        commentManager.gettingComment = false;
        commentManager.type = type;
        commentManager.item = item;
        if (commentManager.type === 'file') commentManager.key = commentManager.item.id;
        else if (commentManager.type === 'lesson') commentManager.key = commentManager.item.name;
        else commentManager.disabled = true;
      };
      commentManager.get = function () {
        commentManager.comment = '';
        commentManager.gettingComment = true;
        Comment.get({
            type: commentManager.type,
            key: commentManager.key,
          },
          function (response) {
            commentManager.gettingComment = false;
            if (response['res_code'] === 0) {
              commentManager.comments = response['data']['comments'];
            } else {
              commentManager.comments = [];
              toast.show(response['msg'], 'error');
            }
          },
          function () {
            commentManager.gettingComment = false;
            commentManager.comments = [];
            toast.show('无法获取评论', 'error');
          });
      };
      commentManager.send = function () {
        toast.show('正在提交评论', 'success');
        Comment.save({
            type: commentManager.type,
            key: commentManager.key,
          }, {
            username: user.anonymous ? '匿名' : user.username || user.name,
            comment: commentManager.comment,
            token: user.token
          },
          function (response) {
            if (response['res_code'] === 0) {
              commentManager.get();
            } else {
              toast.show(response['msg'], 'error');
            }
          },
          function () {
            toast.show('无法连接到服务器', 'error');
          });
      };
      commentManager.remove = function (commentId) {
        toast.show('正在删除', 'success');
        Comment.delete({
            type: commentManager.type,
            key: commentManager.key,
            id: commentId,
            token: user.token
          },
          function (response) {
            if (response['res_code'] === 0) {
              commentManager.get();
              toast.show(response['msg'], 'success');
            } else {
              toast.show(response['msg'], 'error');
            }
          },
          function () {
            toast.show('无法连接到服务器', 'error');
          });
      };

      return commentManager;
});
