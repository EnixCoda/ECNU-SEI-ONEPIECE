module.exports = function (grunt) {

  grunt.initConfig({
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
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments:     true,
          collapseWhitespace: true
        },
        files: {
          'dist/index.html': 'app/index.html',
          'dist/blocked.html': 'app/blocked.html',
          'dist/views/about.html': 'app/views/about.html',
          'dist/views/contribute.html': 'app/views/contribute.html',
          'dist/views/file_preview.html': 'app/views/file_preview.html'
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
              replacement: '//ajax.useso.com/ajax/libs/angular_material/1.0.5/angular-material.min.'
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
              replacement: '//ajax.useso.com/ajax/libs/angularjs/1.4.9/'
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
    }
  });

  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat', 'htmlmin', 'replace']);

};