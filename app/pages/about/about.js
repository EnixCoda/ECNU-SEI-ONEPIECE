angular.module('onepiece')
  .controller('AboutController',
    ($scope, popper) => {
      $scope.popper = popper

      const about = {
        label: '欢迎与简介',
        notes: [
          {
            title: '欢迎，ECNU SCSSEer!',
            content: [
              '这里有你学习中需要的绝大部分资料，它们是历代前辈精挑细选后上传的优质资源，包括但不限于课件、考卷、习题、答案、参考资料，全部免费取用。',
              '请注意，站内不设人工管理员，资料管理完全依赖于各位同学的"公共意志"与自觉。',
              '希望你能遵守站点的规则，珍惜、妥善利用站内资源，这样本站才能够长久运作下去、为更多的同学服务。',
              '下面是一些你可能想了解的问题，若想查阅站内文件的管理方式，请前往"文件规则"标签页。'
            ]
          },
          {
            title: '这是什么网站？',
            content: [
              '这是面向ECNU计算机科学与软件工程学院本科学生的学习资料共享平台',
              '也是学习资料重复搬运的终点',
            ]
          },
          {
            title: '如何使用这个网站？',
            content: [
              '站内所有资料都可以自由下载、查阅，用于学习用途。',
              '每位登陆的同学都可以对站点内的资料、课程进行评价，也可以上传新资料、修改旧资料。',
              '对于需要修整的资料（过期/低质量/位置不当的资料），将在多位用户提交相同的修整请求、请求数量达到阈值(5)后触发修整。',
              '每位用户都是本站的使用者、贡献者、管理者。',
              '为了给同学们提供更多帮助，请不吝贡献你的一份力：上传你手中的优秀资料、帮助管理本站。'
            ]
          },
          {
            title: '做这个网站的目的是什么？',
            content: [
              '以往每年学弟学妹的学习资料都是从前辈处以文件传输的方式获得的，次年又转发给各自的学弟学妹。',
              '这种“代代相传”的方式非常低效。每个人的社交圈有限，得到的资料往往不够全面，能够传递下去的更是稀少。许多优质的资料就此流失。',
              '通过这个网站集中保存、传递学习资料，可以有效避免上述问题。'
            ]
          },
          {
            title: '为什么不直接使用网盘来传递资料？',
            content: [
              '大多数网盘目前不支持用户为文件作出评价等反馈，而评价是本站的重要功能:',
              '通过同学们的评价、反馈，筛选出优质的资源、淘汰过期或不适宜的资源。',
              '由此站内资料经过同学们的调整变化，不断获得新资料、淘汰旧资料，可以长期为同学们服务。',
              '以站点的形式存在，更易于控制、提供更多定制化功能。'
            ]
          },
          {
            title: '站内资料包括习题答案，不怕被校领导查水表吗？',
            content: [
              '本站是为了帮助同学们更方便地获取学习资料而建立的。',
              '提供答案、注解是为了方便同学们做完习题后快速校对、加深理解、巩固知识。',
              '对于从本站获取答案进行抄袭、应付了事的部分同学，想必不使用本站也不会独立完成作业。'
            ]
          },
          {
            title: '如何向这个站点提供学习资料？',
            content: [
              '请先详细阅读并理解“文件规则”，然后在右上角的“上传资料”中依照指示操作。'
            ]
          },
          {
            title: '这个网站如何运营？',
            content: [
              '本站的运营需要少量资金和人力，通过把资料都存放于免费云存储省去了绝大部分存储费用，',
              '同时资料管理依赖于同学们的主动评价，因此不需要人工管理，但是需要开发人员开发更多功能。',
              '欢迎有志于参与本站管理的同学向站长提交你的申请，一起开发本站。',
              '简单的要求: 掌握基础的Angular(前端)或PHP(后端)。',
              '发送邮件到 ecnuseionepiece@163.com。',
              '内容包括但不限于你的基本信息、掌握的技能。'
            ]
          }
        ]
      }
      const rules = {
        'label': '文件规则',
        'notes': [
          {
            title: '',
            content: [
              '完整阅读本规则并理解需要约3分钟的时间，若你有意上传资料/修改站内资料，还请耐心读完并遵照执行。优质的资料非常重要，良好的结构可以让它们更易于取用。感谢你的付出！',
              '',
              '文件夹、文件名称中请尽量避免使用空格',
              '课程文件夹命名请以课程的正式名称为准',
              '各个课程的文件都应置于该课程的文件夹内，若位置有误，请使用 修改 功能。',
              '若一门课程有实践课，应将其资料存入该课程的理论课文件夹内的“实践课”文件夹内',
              '课程资料按以下方式分类（各为一个文件夹）:',
              '1)课件',
              '若多位教师教授该课程，且课件不同，应在文件夹名称中注明授课教师，如:"C++语言程序设计-鲍钰"',
              '若教师的PPT有新版本，应在文件夹名注明年份，如:"C++语言程序设计-2016"',
              '若以上情况同时发生，则先注明授课教师的姓名，如:"C++语言程序设计-鲍钰-2016"',
              '2)考卷',
              '考卷依时间归入以各自时间命名的文件夹内，格式如:"2015-2016(一)-期中"，"2015-2016(一)-月考2"',
              '同一考试的单个考卷文件的名称应与考试名一致，如:"2015-2016(一)-期中.docx"',
              '同一考试的多个考卷文件的名称以在考试名后添加数字后缀为宜，如:"2015-2016(一)-期中-1.jpg"',
              '对于多个来源的同一考卷，仅保留清晰度最高、卷面最整洁的一份',
              '考卷答案与试题应放入同一文件夹，命名方式为 [考试名称]-答案-[编号]，如:"2015-2016(一)-期中-答案-1.jpg"',
              '考卷上作答痕迹应尽量少，最佳状态为未作答的、填入答案的各持一份',
              '若出现考卷重复使用的情况，无需删除旧考卷，可标注好时间后再次上传',
              '3)习题',
              '以教师布置的课程作业为主，此处规则参考课件文件夹的规则，亦可添加高质量的其他来源习题',
              '习题依来源归入以各自来源命名的文件夹内，如:"课后作业-鲍钰"',
              '4)其他资料',
              '该文件夹包括电子版教材，应视情况在文件名注明教材全名、出版社、版次、语言等信息',
              '无法归入上述分类但有保留价值的资料也应置于该文件夹内' +
              '代码文件请压缩后上传',
              '5)[自命名文件夹]',
              '数量较大且不属于1-4的同类文件，不归入其他资料，根据其统一性质特别建立该文件夹用于存放，名称视具体内容决定',
              '若一门课程的资料文件总数不超过12个，可省去以上分类操作',
              '',
              '若对规则还有疑惑，欢迎在根目录的"意见反馈"中提出，站长将查阅并改进规则。',
            ]
          }
        ]
      }
      const safari = {
        label: 'App模式',
        notes: [
          {
            title: '本站点支持App模式',
            content: [
              '通过下述方式进行简单的操作，即可将本站点添加到你的主屏幕。',
              '自此从主屏幕进入本站点时将以App模式启动，以获得更佳的体验。',
              '1. 请确认你正在使用Safari浏览器访问本站',
              '2. 点击浏览器底部中间的分享按钮',
              '3. 点击“添加到主屏幕”按钮',
              '4. 点击弹出窗口右上角的“添加“按钮（如有需要，此时可以编辑标题，但请勿编辑地址）',
              '5. 点击主屏幕上的本站图标，体验onepiece App'
            ]
          }
        ]
      }
      $scope.tabs = [about, rules]
      if (navigator.userAgent.match(/(iPhone|iPad).*Safari/)) {
        $scope.tabs.push(safari)
      }
    })
