import angular from 'angular'

export default angular.module('onepiece')
  .factory('comment',
    ($resource, toast, user) => {
      const Comment = $resource('/:type/:key/comment', {}, {})

      const commentManager = {}
      commentManager.set = (type, item) => {
        commentManager.gettingComment = false
        commentManager.type = type
        commentManager.item = item
        commentManager.comments = undefined
        if (commentManager.type === 'file') commentManager.key = commentManager.item.id
        else if (commentManager.type === 'lesson') commentManager.key = commentManager.item.name
        else commentManager.disabled = true
      }
      commentManager.get = () => {
        commentManager.comment = ''
        commentManager.gettingComment = true
        Comment.get({
          type: commentManager.type,
          key: commentManager.key,
        },
          (response) => {
            commentManager.gettingComment = false
            if (response['res_code'] === 0) {
              commentManager.comments = response['data']['comments']
            } else {
              commentManager.comments = undefined
              toast.show(response['msg'], 'error')
            }
          },
          () => {
            commentManager.gettingComment = false
            commentManager.comments = undefined
            toast.show('无法获取评论', 'error')
          })
      }
      commentManager.send = () => {
        toast.show('正在提交评论')
        Comment.save({
          type: commentManager.type,
          key: commentManager.key,
        }, {
          username: user.anonymous ? '匿名' : user.alia || user.name,
          comment: commentManager.comment
        },
          (response) => {
            if (response['res_code'] === 0) {
              commentManager.get()
            } else {
              toast.show(response['msg'], 'error')
            }
          },
          () => {
            toast.show('无法连接到服务器', 'error')
          })
      }
      commentManager.remove = (comment) => {
        if (!confirm(`请确认是否删除该评论：${comment.comment}`)) return
        toast.show('正在删除评论', 'warning')
        Comment.delete({
          type: commentManager.type,
          key: commentManager.key,
          id: comment.id
        },(response) => {
          if (response['res_code'] === 0) {
            commentManager.get()
          } else {
            toast.show(response['msg'], 'error')
          }
        },() => {
          toast.show('无法连接到服务器', 'error')
        })
      }

      return commentManager
    })
