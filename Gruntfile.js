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
    wiredep: {
      task: {
        src:     [
          'app/index.html'
        ],
        options: {
          exclude: ['/angular-messages/']
        }
      }
    },
    concat:  {
      options:     {
        //separator: ';'
      },
      scripts:     {
        src:  ['app/scripts/*.js'],
        dest: 'dist/scripts.js'
      },
      angularUpload: {
        src: ['bower_components/ng-file-upload/ng-file-upload.min.js'],
        dest: 'dist/ng-file-upload.min.js'
      }
      //css: {
      //  src: ['app/style.css'],
      //  dest: 'dist/style.css'
      //}
    },
    htmlmin: {
      dist: {
        options: {
          removeComments:     true,
          collapseWhitespace: true
        },
        files: {
          'dist/index.html': 'app/index.html',
          'dist/views/about.html': 'app/views/about.html',
          'dist/views/contribute.html': 'app/views/contribute.html',
          'dist/views/file_preview.html': 'app/views/file_preview.html',
          'dist/views/user_center.html': 'app/views/user_center.html'
        }
      }
    },
    cdnify:  {
      options: {
        cdn: require('google-cdn-data')
      },
      dist:    {
        html: ['dist/index.html']
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
        ////ajax.googleapis.com/ajax/libs/angularjs/1.4.9/angular.min.js"></script>
        options: {
          patterns: [
            {
              match: /\.\.\/bower_components\/angular.*?\//g,
              replacement: '//ajax.lug.ustc.edu.cn/ajax/libs/angularjs/1.5.0-rc.2/'
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
      },
      angularUpload: {
        options: {
          patterns: [
            {
              match: /<script src="\.\.\/bower_components\/ng-file-upload\/ng-file-upload\.js">/g,
              replacement: '<script src="ng-file-upload.min.js">'
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
    ngmin: {
      controllers: {
        src: ['test/src/controllers/one.js'],
        dest: 'test/generated/controllers/one.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', ['cssmin', 'concat', 'htmlmin', 'replace']);

};