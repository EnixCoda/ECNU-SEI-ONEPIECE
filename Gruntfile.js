'use strict';

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-babel');

  grunt.initConfig({
    angularMaterial: {
      version: '1.1.0-rc4'
    },
    angular: {
      version: '1.5.8'
    },
    clean: {
      dist: ['dist'],
      afterDist: ['dist/pages', 'dist/scripts']
    },
    cssmin: {
      target: {
        files: {
          'dist/onepiece.min.css': ['bower_components/angular-material/angular-material.min.css', 'app/app.css']
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
          'dist/onepiece.js': [
            'bower_components/angular/angular.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-aria/angular-aria.js',
            'bower_components/angular-material/angular-material.js',
            'dist/scripts/app.js',
            'dist/scripts/*.js'],
          'dist/qiniuUpload.js': ['app/deps/*.js', '!app/deps/*.min.js']
        }
      },
      deploy: {
        files: {
          'dist/onepiece.js': [
            'bower_components/angular/angular.min.js',
            'bower_components/angular-animate/angular-animate.min.js',
            'bower_components/angular-aria/angular-aria.min.js',
            'bower_components/angular-material/angular-material.min.js',
            'dist/scripts/app.js',
            'dist/scripts/*.js'],
          'dist/qiniuUpload.min.js': ['app/deps/*.min.js'],
          'dist/qiniu.min.map': ['app/deps/qiniu.min.map']
        }
      }
    },
    babel: {
      options: {
          presets: ['es2015']
      },
      dist: {
          files: {
              'dist/onepiece.js': 'dist/onepiece.js'
          }
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/onepiece.min.js': ['dist/onepiece.js']
        }
      }
    },
    replace: {
      comments: {
        options: {
          patterns: [
            {
              match: /\/\/.*/,
              replacement: ''
            }
          ]
        },
        files: [
          {
            expand: true,
            cwd: 'dist/',
            dest: 'dist/',
            src: ['*.js'],
            flatten: true
          },
        ]
      },
      scriptsDeploy: {
        options: {
          patterns: [
            {
              match: /<!--foot scripts-->(.|[\n])*<!--end foot scripts-->/m,
              replacement: [
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
    copy: {
      toServer: {
        files: [
          {
            expand: true,
            cwd: 'dist/',
            src: ['**'],
            dest: '../ECNU-SEI-ONEPIECE-API-V2/public/'
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

  grunt.registerTask('injectHTML', 'inject angular HTML templates into js', function () {
    var fs = require('fs');
    var data = fs.readFileSync('dist/onepiece.js', {encoding: 'utf-8'});
    grunt.log.writeln('onepiece.js loaded!');
    let matches = data.match(/templateUrl: '(.*)'/g);
    grunt.log.writeln('found ' + matches.length + ' templates');
    if (matches) {
      matches.forEach(function (match) {
        let filepath = 'dist/pages/' + /templateUrl: '(.*)'/.exec(match)[1];
        try {
          fs.statSync(filepath);
          let toInject = fs.readFileSync(filepath, {encoding: 'utf-8'});
          grunt.log.writeln('found templateUrl: ' + match);
          data = data.replace(match, `template: \`${toInject}\``);
        } catch(err) {
          if (err.code == 'ENOENT') {
            console.log("skipped", filepath);
          } else {
            throw err;
          }
        }
      });
    }
    fs.writeFileSync('dist/onepiece.js', data, {encoding: 'utf-8'});
  });
  grunt.registerTask('prepare', ['clean:dist', 'htmlmin', 'cssmin', 'ngAnnotate']);
  grunt.registerTask('curtain', ['injectHTML', 'clean:afterDist']);
  grunt.registerTask('dev', ['prepare', 'concat:dev', 'replace:scriptsDev', 'replace:cssDev', 'replace:comments', 'curtain', 'copy']);
  grunt.registerTask('deploy', ['prepare', 'concat:deploy', 'replace:scriptsDeploy', 'replace:cssDeploy', 'replace:comments', 'curtain', 'babel', 'uglify', 'copy']);

};