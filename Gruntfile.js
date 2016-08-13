module.exports = function (grunt) {
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
        //separator: ';'
      },
      scripts: {
        src: ['app/scripts/*.js'],
        dest: 'dist/scripts.js'
      },
      qiniuUpload: {
        src: ['app/deps/*.min.js'],
        dest: 'dist/qiniuUpload.min.js'
      },
      qiniuMap: {
        src: ['app/deps/qiniu.min.map'],
        dest: 'dist/qiniu.min.map'
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
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
      scripts: {
        options: {
          patterns: [
            {
              match: /<script src="scripts\/.*?.js"><\/script>/g,
              replacement: ''
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
      qiniuUpload: {
        options: {
          patterns: [
            {
              match: /<script src="deps\/moxie.js"><\/script><script src="deps\/plupload.dev.js"><\/script><script src="deps\/qiniu.js">/g,
              replacement: '<script src="qiniuUpload.min.js"></script>'
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
      css: {
        options: {
          patterns: [
            {
              match: /<link rel="stylesheet" href="style\.css">/g,
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
      scriptConcated: {
        options: {
          patterns: [
            {
              match: /<\/html>/g,
              replacement: '<script src="scripts.js"></script></html>'
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
      angularMaterial: {
        options: {
          patterns: [
            {
              match: /\.\.\/bower_components\/angular-material\/angular-material\./g,
              replacement: '//ajax.lug.ustc.edu.cn/ajax/libs/angular_material/1.1.0-rc2/angular-material.min.'
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
      angularJSCDN: {
        options: {
          patterns: [
            {
              match: /\.\.\/bower_components\/angular.*?\//g,
              replacement: '//ajax.lug.ustc.edu.cn/ajax/libs/angularjs/1.4.9/'
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
      angularJSCDNminify: {
        options: {
          patterns: [
            {
              match: /angular\.js/g,
              replacement: 'angular.min.js'
            },
            {
              match: /angular-animate\.js/g,
              replacement: 'angular-animate.min.js'
            },
            {
              match: /angular-aria\.js/g,
              replacement: 'angular-aria.min.js'
            }
          ]
        },
        files: [
          {
            src: ['dist/index.html'],
            dest: './'
          }
        ]
      }
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
    ngAnnotate: {
      options: {
        // Task-specific options go here.
      },
      my_target: {
        // Target-specific file lists and/or options go here.
      }
    }
  });

  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', ['cssmin', 'concat', 'htmlmin', 'replace']);

};