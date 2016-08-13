var fs = require('fs');
module.exports = function (grunt) {
  'use strict';
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'app',
          src: ['*.css', '!*.min.css'],
          dest: 'dist',
          ext: '.min.css'
        }]
      }
    },
    concat: {
      options: {
        // banner: '',
        // separator: ';',
        // footer: '',
        // stripBanners: true,
        // Replace all 'use strict' statements in the code with a single one at the top
        banner: "'use strict';\n",
        process: function (src, filepath) {
          // return '// Source: ' + filepath + '\n' + src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
          return src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
        }
      },
      dev: {
        files: {
          'dist/scripts.js': ['app/scripts/*.js'],
          'dist/qiniuUpload.js': ['app/deps/*.js', '!app/deps/*.min.js'],
        }
      },
      deploy: {
        files: {
          'dist/scripts.js': ['app/scripts/*.js'], // TODO: when to use ngAnnotate?
          'dist/qiniuUpload.min.js': ['app/deps/*.min.js'],
          'dist/qiniu.min.map': ['app/deps/qiniu.min.map']
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: false,
          collapseWhitespace: true
        },
        files: {
          'dist/index.html': 'app/index.html',
          'dist/views/about.html': 'app/views/about.html',
          'dist/views/contribute.html': 'app/views/contribute.html',
          'dist/views/file_preview.html': 'app/views/file_preview.html',
          'dist/views/lesson_preview.html': 'app/views/lesson_preview.html',
          'dist/views/user_center.html': 'app/views/user_center.html',
          'dist/views/ranking.html': 'app/views/ranking.html',
          'dist/views/edit.html': 'app/views/edit.html'
        }
      }
    },
    replace: {
      scriptsDeploy: {
        options: {
          patterns: [
            {
              match: /<!--foot scripts-->(.|[\n])*<!--end foot scripts-->/m,
              replacement: [
                '<script src="//ajax.lug.ustc.edu.cn/ajax/libs/angularjs/1.4.9/angular.min.js"></script>',
                '<script src="//ajax.lug.ustc.edu.cn/ajax/libs/angularjs/1.4.9/angular-animate.min.js"></script>',
                '<script src="//ajax.lug.ustc.edu.cn/ajax/libs/angularjs/1.4.9/angular-aria.min.js"></script>',
                '<script src="//ajax.lug.ustc.edu.cn/ajax/libs/angular_material/1.1.0-rc2/angular-material.min.js"></script>',
                '<script src="qiniuUpload.min.js"></script>',
                '<script src="scripts.js"></script>'
              ].join('')
            }
          ]
        },
        files: [
          {
            src: ['dist/index.html'],
            dest: './'
          }
        ]
      },
      cssDeploy: {
        options: {
          patterns: [
            {
              match: /<!--head stylesheets-->(.|[\n])*<!--end head stylesheets-->/m,
              replacement: '<link rel="stylesheet" href="style.min.css"/>'
            }
          ]
        },
        files: [
          {
            src: ['dist/index.html'],
            dest: './'
          }
        ]
      },
      scriptsDev: {
        options: {
          patterns: [
            {
              match: /<!--foot scripts-->(.|[\n])*<!--end foot scripts-->/m,
              replacement: [
                '<script src="//ajax.lug.ustc.edu.cn/ajax/libs/angularjs/1.4.9/angular.js"></script>',
                '<script src="//ajax.lug.ustc.edu.cn/ajax/libs/angularjs/1.4.9/angular-animate.js"></script>',
                '<script src="//ajax.lug.ustc.edu.cn/ajax/libs/angularjs/1.4.9/angular-aria.js"></script>',
                '<script src="//ajax.lug.ustc.edu.cn/ajax/libs/angular_material/1.1.0-rc2/angular-material.js"></script>',
                '<script src="qiniuUpload.js"></script>',
                '<script src="scripts.js"></script>'
              ].join('')
            }
          ]
        },
        files: [
          {
            src: ['dist/index.html'],
            dest: './'
          }
        ]
      },
      cssDev: {
        options: {
          patterns: [
            {
              match: /<!--head stylesheets-->(.|[\n])*<!--end head stylesheets-->/m,
              replacement: [
                '<link rel="stylesheet" href="style.min.css"/>',
                '<link rel="stylesheet" href="//ajax.lug.ustc.edu.cn/ajax/libs/angular_material/1.1.0-rc2/angular-material.min.css">'
              ].join('')
            }
          ]
        },
        files: [
          {
            src: ['dist/index.html'],
            dest: './'
          }
        ]
      },
    },
    wiredep: {
      task: {
        src: [
          'app/index.html'
        ],
        options: {
          exclude: ['/angular-messages/']
        }
      }
    },
    ngAnnotate: { // TODO: use this
      options: {
        // Task-specific options go here.
      },
      my_target: {
        // Target-specific file lists and/or options go here.
      }
    },
    watch: {
      files: ['app/**/*'],
      tasks: ['dev']
    }
  });

  grunt.event.on('watch', function (action, path, target) {
    grunt.log.writeln(target + ': ' + path + ' has ' + action);
  });

  grunt.registerTask('dev', ['cssmin', 'htmlmin', 'concat:dev', 'replace:scriptsDev', 'replace:cssDev']);
  grunt.registerTask('deploy', ['cssmin', 'concat:deploy', 'ngAnnotate', 'htmlmin', 'replace:scriptsDev', 'replace:cssDev']);

};