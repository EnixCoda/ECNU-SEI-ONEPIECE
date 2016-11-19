'use strict';

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-babel');

  grunt.initConfig({
    config: grunt.file.readJSON('config.json'),
    clean: {
      options: {
        force: true
      },
      serverRoot: ['<%= config.serverRoot %>'],
      dist: ['dist'],
      midFile: ['dist/html', 'dist/scripts', 'dist/css']
    },
    cssmin: {
      allCSS:{
        files: {
          'dist/app.css': ['dist/app.css']
        }
      }
    },
    htmlmin: {
      options: {
        removeComments: true,
        collapseWhitespace: true
      },
      index: {
        files: {
          'dist/index.html': ['app/index.html']
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
      css: {
        files: {
          'dist/app.css': [
            'node_modules/angular-material/angular-material.css',
            'app/app.css'
          ]
        }
      },
      controllers: {
        files: {
          'dist/scripts/controllers.js': ['app/pages/**/*.js']
        }
      },
      allAppJS: {
        files: {
          'dist/app.js': [
            'node_modules/angular/angular.js',
            'node_modules/angular-resource/angular-resource.js',
            'node_modules/angular-animate/angular-animate.js',
            'node_modules/angular-aria/angular-aria.js',
            'node_modules/angular-material/angular-material.js',
            'app/app.js',
            'app/components/*.js',
            'app/controllers/*.js',
            'app/filters/*.js',
            'app/services/*.js',
            'dist/scripts/*.js'
          ]
        }
      },
      vendorJS: {
        files: {
          'dist/app.js': ['dist/app.js', 'vendors/*.min.js']
        }
      }
    },
    babel: {
      options: {
        compact: false,
        presets: ['es2015']
      },
      dist: {
        files: {
          'dist/app.js': 'dist/app.js'
        }
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/app.js': ['dist/app.js']
        }
      },
      loader: {
        files: {
          'dist/scripts/loader.js': ['app/loader.js']
        }
      }
    },
    ngtemplates: {
      options: {
        module: 'onepiece'
      },
      dev: {
        options: {
          htmlmin: {
            collapseBooleanAttributes:      true,
            collapseWhitespace:             true,
            removeAttributeQuotes:          true,
            removeComments:                 true,
            removeRedundantAttributes:      true,
            removeScriptTypeAttributes:     true,
            removeStyleLinkTypeAttributes:  true
          },
          url: function(url) { return url.split('/').pop(); }
        },
        prefix: './',
        src: ['app/**/*.html'],
        dest: 'dist/scripts/templates.js'
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
            src: ['dist/app.js'],
            flatten: true,
            ext: '.js',
            dest: 'dist/'
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
            dest: '<%= config.serverRoot %>'
          }
        ]
      },
      fonts: {
        files: [
          {
            expand: true,
            cwd: 'vendors/fonts/',
            src: ['*'],
            dest: 'dist/'
          }
        ]
      },
      qiniuMap: {
        files: {
          'dist/qiniu.min.map': ['app/deps/qiniu.min.map']
        }
      }
    },
    watch: {
      app: {
        files: ['app/**/*'],
        tasks: ['dev']
      }
    }
  });

  grunt.event.on('watch', function (action, path, target) {
    grunt.log.writeln(target + ': ' + path + ' has ' + action);
  });

  grunt.registerTask('injectLoader', 'inject loader.js into index.html', function () {
    // run after htmlmin, concat scripts
    var fs = require('fs');
    var html = fs.readFileSync('dist/index.html', {encoding: 'utf-8'});
    grunt.log.writeln('index.html loaded!');
    var loader = fs.readFileSync('dist/scripts/loader.js', {encoding: 'utf-8'});
    grunt.log.writeln('loader.js loaded!');
    html = html.replace('<loader></loader>', `<script>${loader}</script>`);
    fs.writeFileSync('dist/index.html', html, {encoding: 'utf-8'});
  });

  grunt.registerTask('dev', [
    'clean:dist','clean:serverRoot',
    'htmlmin', 'concat:css',
    'concat:controllers', 'ngtemplates', 'concat:allAppJS', 'uglify:loader', 'injectLoader',
    'concat:vendorJS', 'copy:fonts', 'copy:qiniuMap', 'clean:midFile',
    'copy:toServer'
  ]);

  grunt.registerTask('deploy', [
    'clean:dist','clean:serverRoot',
    'htmlmin', 'concat:css',
    'concat:controllers', 'ngtemplates', 'concat:allAppJS', 'uglify:loader', 'injectLoader',
    'ngAnnotate', 'cssmin', 'babel', 'uglify:dist',
    'concat:vendorJS', 'copy:fonts', 'copy:qiniuMap', 'clean:midFile',
    'copy:toServer'
  ]);
};