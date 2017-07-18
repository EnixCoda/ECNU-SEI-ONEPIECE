module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-htmlmin')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-ng-annotate')
  grunt.loadNpmTasks('grunt-angular-templates')
  grunt.loadNpmTasks('grunt-babel')

  grunt.initConfig({
    config: grunt.file.readJSON('config.json'),
    clean: {
      options: {
        force: true
      },
      serverRoot: [
        '<%= config.serverRoot %>/assets/',
        '<%= config.serverRoot %>/service-worker.js',
        '<%= config.serverRoot %>/manifest.json',
      ],
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
        // process: function(src, filepath) {
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
        options: {
          footer: '//# sourceURL=assets/app.js'
        },
        files: {
          'dist/app.js': [
            'app/app.js',
            'app/controllers/*.js',
            'app/components/*.js',
            'app/filters/*.js',
            'app/services/*.js',
            'dist/scripts/*.js'
          ]
        }
      },
      vendorJS: {
        options: {
          footer: '//# sourceURL=assets/vendor.js'
        },
        files: {
          'dist/vendor.js': [
            'node_modules/angular/angular.js',
            'node_modules/angular-resource/angular-resource.js',
            'node_modules/angular-animate/angular-animate.js',
            'node_modules/angular-aria/angular-aria.js',
            'node_modules/angular-material/angular-material.js',
            'node_modules/plupload/js/moxie.js',
            'node_modules/plupload/src/moxie/src/javascript/o.js',
            'node_modules/plupload/js/plupload.dev.js',
            'node_modules/tbs-qiniu-js/dist/qiniu.js',
          ]
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
        files: [{
          expand: true,
          src: ['dist/*.js'],
          flatten: true,
          dest: 'dist'
        }]
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
          url: function(url) { return url.split('/').pop() }
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
            dest: '<%= config.serverRoot %>/assets'
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
      },
      serviceWorker: {
        files: {
          '<%= config.serverRoot %>/service-worker.js': ['app/service-worker.js']
        }
      },
      manifest: {
        files: {
          '<%= config.serverRoot %>/manifest.json': ['app/manifest.json']
        }
      }
    },
    watch: {
      app: {
        files: ['app/**/*'],
        tasks: ['dev']
      }
    }
  })

  grunt.event.on('watch', function(action, path, target) {
    grunt.log.writeln(target + ': ' + path + ' has ' + action)
  })

  grunt.registerTask('signVersion', 'inject loader.js into index.html, sign version to service-worker.js', function() {
    // run after htmlmin, concat scripts
    var fs = require('fs')
    var md5 = require('md5')
    var html = fs.readFileSync('dist/index.html', {encoding: 'utf-8'})
    grunt.log.writeln('index.html loaded!')
    var serviceWorkerJS = fs.readFileSync('app/service-worker.js', {encoding: 'utf-8'})
    grunt.log.writeln('service-worker.js loaded!')
    var loader = fs.readFileSync('dist/scripts/loader.js', {encoding: 'utf-8'})
    grunt.log.writeln('loader.js loaded!')
    var loads = loader
      .match(/\w+\("(\/assets.*?)"/g)
      .map(function(cur) {
        return cur.replace(/\w+\("(.*?)"/, '$1').split('/').pop()
      })
      .forEach(function(load) {
        var content = fs.readFileSync('dist/' + load, {encoding: 'utf-8'})
        var hash = md5(content)
        loader = loader.replace(new RegExp('"' + load + '@@version"'), '"' + hash + '"')
        grunt.log.success(load + ' loaded with hash ' + hash)
      })
    html = html.replace('<loader></loader>', `<script>${loader}</script>`)
    fs.writeFileSync('dist/index.html', html, {encoding: 'utf-8'})
    serviceWorkerJS = serviceWorkerJS.replace(/^.*\/\/ @ version declaration/, 'const version = \'' + md5(html) + '\' // @ version declaration')
    fs.writeFileSync('app/service-worker.js', serviceWorkerJS, {encoding: 'utf-8'})
  })

  grunt.registerTask('p0', [
    'clean:dist',
    'htmlmin', 'concat:css',
    'concat:controllers', 'ngtemplates', 'concat:allAppJS', 'concat:vendorJS', 'uglify:loader', 'copy:serviceWorker'
  ])

  grunt.registerTask('p1', [
    'signVersion', 'copy:fonts', 'copy:qiniuMap', 'clean:midFile',
    'clean:serverRoot',  'copy:toServer', 'copy:manifest', 'copy:serviceWorker'
  ])

  grunt.registerTask('dev', ['p0', 'p1'])

  grunt.registerTask('deploy', [
    'p0',
    'babel', 'ngAnnotate', 'cssmin', 'uglify:dist',
    'p1'
  ])
}