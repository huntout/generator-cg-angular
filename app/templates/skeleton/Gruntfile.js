'use strict';
/* global require */

var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;
var _ = require('underscore');
var path = require('path');

module.exports = function(grunt) {

  // Load all grunt tasks
  require('load-grunt-tasks')(grunt, {
    pattern: ['grunt-*', '!grunt-template-*']
  });

  // Project configuration
  grunt.initConfig({
    // configurable paths
    yo: (function() {
      var main = grunt.file.readJSON('package.json').main || 'index.html';
      var assets = path.dirname(main);
      return {
        main: main,
        assets: assets,
        folders: {
          js: 'js,service,filter,directive,partial',
          html: 'directive,partial'
        }
      };
    })(),

    connect: {
      proxies: [{
        context: ['/api', '/userfiles'],
        host: 'localhost',
        port: 8080,
        rewrite: {
          '^/api': '/service'
        }
      }],
      options: {
        middleware: function(connect, options) {
          var middlewares = [proxySnippet];
          if (!Array.isArray(options.base)) {
            options.base = [options.base];
          }
          options.base.forEach(function(base) {
            middlewares.push(connect.static(base));
          });
          return middlewares;
        }
      },
      livereload: {
        options: {
          port: 9000,
          base: ['.', 'temp'],
          open: true
        }
      },
      dist: {
        options: {
          port: 9001,
          base: 'dist'
        }
      }
    },

    watch: {
      options: {
        livereload: true,
        spawn: false
      },
      main: {
        files: ['<%%= yo.main %>', '<%%= yo.assets %>/{css,img,<%%= yo.folders.js %>}/**/*'],
        tasks: [] //all the tasks are run dynamically during the watch event handler
      }
    },

    jshint: {
      main: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: '<%%= yo.assets %>/{<%%= yo.folders.js %>}/**/*.js'
      }
    },

    clean: {
      all: {
        src: ['.grunt', 'dist', 'temp']
      }
    },

    less: {
      options: {
        report: 'min'
      },
      dev: {
        options: {
          sourceMap: true,
          sourceMapFilename: 'temp/<%%= yo.assets %>/css/app.less.css.map',
          sourceMapURL: 'app.less.css.map',
          sourceMapRootpath: '/'
        },
        files: {
          'temp/<%%= yo.assets %>/css/app.less.css': '<%%= yo.assets %>/css/app.less'
        }
      },
      dist: {
        options: {
          cleancss: true
        },
        files: {
          'temp/app.less.css': '<%%= yo.assets %>/css/app.less'
        }
      }
    },

    ngtemplates: {
      main: {
        options: {
          module: '<%= appname %>',
          htmlmin: '<%= htmlmin.main.options %>'
        },
        cwd: '<%%= yo.assets %>',
        src: '{<%%= yo.folders.html %>}/**/*.html',
        dest: 'temp/templates.js'
      }
    },

    copy: {
      main: {
        expand: true,
        cwd: '<%%= yo.assets %>',
        filter: 'isFile',
        src: [
          'img/**',
          'bower_components/angular-ui-utils/ui-utils-ieshiv.*',
          'bower_components/bootstrap/dist/fonts/**',
          'bower_components/font-awesome/fonts/**'
        ],
        dest: 'dist/<%%= yo.assets %>'
      }
    },

    dom_munger: {
      read: {
        options: {
          read: [{
            selector: 'script.lib',
            attribute: 'src',
            writeto: 'libjs'
          }, {
            selector: 'script.cat',
            attribute: 'src',
            writeto: 'catjs'
          }, {
            selector: 'script.app',
            attribute: 'src',
            writeto: 'appjs'
          }, {
            selector: 'link[type="text/css"]',
            attribute: 'href',
            writeto: 'purecss'
          }]
        },
        src: '<%%= yo.main %>'
      },
      update: {
        options: {
          remove: ['link', 'script'],
          append: [{
            selector: 'head',
            html: '<link rel="stylesheet" href="css/app.min.css">'
          }, {
            selector: 'body',
            html: [
              '<script src="js/lib.min.js"></script>',
              // '<script src="js/cat.js"></script>',
              '<script src="js/app.min.js"></script>'
            ].join('\n')
          }]
        },
        src: '<%%= yo.main %>',
        dest: 'dist/<%%= yo.main %>'
      }
    },

    concat: {
      build: {
        files: [{
          src: '<%%= dom_munger.data.purecss %>',
          dest: 'temp/pure.css'
        }, {
          src: '<%%= dom_munger.data.libjs %>',
          dest: 'dist/<%%= yo.assets %>/js/lib.js'
        }, {
          src: '<%%= dom_munger.data.catjs %>',
          dest: 'dist/<%%= yo.assets %>/js/cat.js'
        }, {
          src: '<%%= dom_munger.data.appjs %>',
          dest: 'temp/app.js'
        }, {
          src: ['temp/app.js', '<%%= ngtemplates.main.dest %>'],
          dest: 'dist/<%%= yo.assets %>/js/app.js',
          expand: false
        }].map(function(n) {
          if (n.expand === false) {
            return n;
          }
          return _.extend(n, {
            expand: true,
            cwd: '<%%= yo.assets %>',
            rename: function(destBase /*, destPath*/ ) {
              return destBase;
            }
          });
        })
      },
      jasmine: {
        expand: true,
        cwd: '<%%= yo.assets %>',
        src: [
          '<%%= dom_munger.data.libjs %>',
          '<%%= dom_munger.data.catjs %>',
          'bower_components/angular-mocks/angular-mocks.js'
        ],
        rename: function(destBase /*, destPath*/ ) {
          return destBase;
        },
        dest: 'temp/vendor.js'
      }
    },

    cssmin: {
      main: {
        src: ['temp/app.less.css', 'temp/pure.css'],
        dest: 'dist/<%%= yo.assets %>/css/app.min.css'
      }
    },

    ngmin: {
      lib: {
        src: 'dist/<%%= yo.assets %>/js/lib.js',
        dest: 'dist/<%%= yo.assets %>/js/lib.js'
      },
      main: {
        src: 'dist/<%%= yo.assets %>/js/app.js',
        dest: 'dist/<%%= yo.assets %>/js/app.js'
      }
    },

    uglify: {
      options: {
        report: 'min',
        sourceMapRoot: '/',
        sourceMapPrefix: 1
      },
      lib: {
        options: {
          sourceMap: 'dist/<%%= yo.assets %>/js/lib.min.js.map',
          sourceMappingURL: 'lib.min.js.map'
        },
        src: 'dist/<%%= yo.assets %>/js/lib.js',
        dest: 'dist/<%%= yo.assets %>/js/lib.min.js'
      },
      main: {
        options: {
          sourceMap: 'dist/<%%= yo.assets %>/js/app.min.js.map',
          sourceMappingURL: 'app.min.js.map'
        },
        src: 'dist/<%%= yo.assets %>/js/app.js',
        dest: 'dist/<%%= yo.assets %>/js/app.min.js'
      }
    },

    filerev: {
      options: {
        length: 4
      },
      dist: {
        src: [
          'dist/<%%= yo.assets %>/**/*.{js,css,gif,jpg,png,eot,svg,ttf,woff,otf}',
          '!dist/<%%= yo.assets %>/bower_components/font-awesome/fonts/*.*'
        ]
      }
    },

    usemin: {
      options: {
        assetsDirs: [
          'dist/<%%= yo.assets %>',
          'dist/<%%= yo.assets %>/img'
        ],
      },
      html: ['dist/<%%= yo.main %>'],
      css: ['dist/<%%= yo.assets %>/css/*.css']
    },

    htmlmin: {
      main: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        },
        files: {
          'dist/<%%= yo.main %>': 'dist/<%%= yo.main %>'
        }
      }
    },

    imagemin: {
      main: {
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['**/{*.png,*.jpg}'],
          dest: 'dist/'
        }]
      }
    },

    jasmine: {
      options: {
        keepRunner: true,
        vendor: 'temp/vendor.js',
        specs: '<%%= yo.assets %>/{<%%= yo.folders.js %>}/**/*-spec.js'
      },
      unit: {
        expand: true,
        cwd: '<%%= yo.assets %>',
        src: '<%%= dom_munger.data.appjs %>'
      },
      coverage: {
        expand: true,
        cwd: '<%%= yo.assets %>',
        src: '<%%= dom_munger.data.appjs %>',
        options: {
          template: require('grunt-template-jasmine-istanbul'),
          templateOptions: {
            coverage: 'temp/coverage/coverage.json',
            report: [{
              type: 'html',
              options: {
                dir: 'temp/coverage/html'
              }
            }, {
              type: 'cobertura',
              options: {
                dir: 'temp/coverage/cobertura'
              }
            }, {
              type: 'text-summary'
            }]
          }
        }
      }
    }
  });

  // Register task
  grunt.registerTask('serve', function(target) {
    if (target === 'dist') {
      return grunt.task.run([
        'build',
        'configureProxies',
        'connect:dist:keepalive'
      ]);
    }

    grunt.task.run([
      'jshint',
      'less:dev',
      'dom_munger:read',
      'configureProxies',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'jshint',
    'clean',
    'less:dist',
    'dom_munger:read',
    'ngtemplates',
    'concat:build',
    'cssmin',
    'ngmin',
    'uglify',
    'copy',
    'dom_munger:update',
    'filerev',
    'usemin',
    'htmlmin',
    'imagemin'
  ]);

  grunt.registerTask('test', function(target) {
    if (target === 'watch') {
      return grunt.task.run([
        'test',
        'watch'
      ]);
    }

    if (target === 'build') {
      return grunt.task.run([
        'dom_munger:read',
        'concat:jasmine',
        'jasmine:coverage:build'
      ]);
    }

    grunt.task.run([
      'jshint',
      'dom_munger:read',
      'concat:jasmine',
      'jasmine:coverage'
    ]);
  });

  grunt.registerTask('default', ['build']);

  grunt.event.on('watch', function(action, filepath) {
    //https://github.com/gruntjs/grunt-contrib-watch/issues/156

    function endWith(str, find) {
      return str.slice(-find.length) === find;
    }

    if (endWith(filepath, '.js')) {

      //lint the changed js file
      grunt.config('jshint.main.src', filepath);
      grunt.task.run('jshint');

      //find the appropriate unit test for the changed file
      var spec = filepath;
      if (!endWith(filepath, '-spec.js')) {
        spec = filepath.slice(0, -3) + '-spec.js';
      }

      //if the spec exists then lets run it
      if (grunt.file.exists(spec)) {
        grunt.config('jasmine.unit.options.specs', spec);
        grunt.task.run('jasmine:unit');
      }
    } else if (endWith(filepath, '.less')) {

      grunt.task.run('less:dev');
    }

    //if index.html changed, we need to reread the <script> tags so our next run of jasmine
    //will have the correct environment
    if (filepath === '<%%= yo.main %>') {
      grunt.task.run('dom_munger:read');
    }
  });
};
