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
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.initConfig({
    clean: {
      dist: ['dist']
    },
    cssmin: {
      target: {
        files: {
          'dist/onepiece.min.css': 'app/app.css'
        }
      }
    },
    concat: {
      options: {
        // banner: '',
        // separator: ';',
        // footer: '',
        // stripBanners: true,
        // Replace all 'use strict' statements in the code with a single one at the top
        // banner: "'use strict';\n",
        // process: function (src, filepath) {
        //   return '// Source: ' + filepath + '\n' + src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
        //   // return src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
        // }
      },
      dev: {
        files: {
          'dist/onepiece.js': ['dist/scripts/app.js', 'dist/scripts/*.js'],
          'dist/qiniuUpload.js': ['app/deps/*.js', '!app/deps/*.min.js'],
          'dist/index.json': ['app/index.json']
        }
      },
      deploy: {
        files: {
          'dist/onepiece.js': ['app/scripts/*.js'],
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
        files: [
          {
            expand: true,
            dest: './dist/',
            cwd: './',
            src: ['app/index.html'],
            flatten: true
          },
          {
            expand: true,
            dest: './dist/pages/',
            src: ['app/pages/**/*.html'],
            flatten: true
          },
        ]
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
                '<script src="onepiece.min.js"></script>'
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
              replacement: [
                '<link rel="stylesheet" href="//ajax.lug.ustc.edu.cn/ajax/libs/angular_material/1.1.0-rc2/angular-material.min.css">',
                '<link rel="stylesheet" href="onepiece.min.css"/>'
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
      scriptsDev: {
        options: {
          patterns: [
            {
              match: /<!--foot scripts-->(.|[\n])*<!--end foot scripts-->/m,
              replacement: [
                '<script src="../bower_components/angular/angular.js"></script>',
                '<script src="../bower_components/angular-animate/angular-animate.js"></script>',
                '<script src="../bower_components/angular-aria/angular-aria.js"></script>',
                '<script src="../bower_components/angular-material/angular-material.js"></script>',
                '<script src="qiniuUpload.js"></script>',
                '<script src="onepiece.js"></script>'
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
                '<link rel="stylesheet" href="../bower_components/angular-material/angular-material.css"/>',
                '<link rel="stylesheet" href="onepiece.min.css"/>'
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
    ngAnnotate: {
      options: {
        add: true,
        regexp: /.*/,
        singleQuotes: true,
      },
      dev: {
        files: [
          {
            expand: true,
            src: ['app/**/*.js', '!app/deps/*'],
            flatten: true,
            ext: '.js',
            dest: 'dist/scripts/'
          }
        ]
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

  grunt.registerTask('inject', 'inject angular HTML templates into js', function () {
    var fs = require('fs');
    var data = fs.readFileSync('dist/onepiece.js', {encoding: 'utf-8'});
    grunt.log.writeln('onepiece.js loaded!');
    let matchs = data.match(/templateUrl: '(.*)'/g);
    if (matchs) {
      matchs.forEach(function (match) {
        let toInject = fs.readFileSync('dist/pages/' + /templateUrl: '(.*)'/.exec(match)[1], {encoding: 'utf-8'});
        grunt.log.writeln(match);
        data = data.replace(match, `template: \`${toInject}\``);
      });
    }
    grunt.log.writeln(fs.writeFileSync('dist/onepiece.js', data, {encoding: 'utf-8'}));
  });
  grunt.registerTask('dev', ['clean', 'htmlmin', 'cssmin', 'ngAnnotate', 'concat:dev', 'replace:scriptsDev', 'replace:cssDev', 'inject']);
  grunt.registerTask('deploy', ['clean', 'htmlmin', 'cssmin', 'ngAnnotate', 'concat:deploy', 'replace:scriptsDeploy', 'replace:cssDeploy', 'inject']);

};