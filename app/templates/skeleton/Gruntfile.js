'use strict';
/* global require */

var path = require('path');

var folderMount = function folderMount(connect, point) {
  return connect.static(path.resolve(point));
};

var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

module.exports = function(grunt) {

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
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
          return [
            proxySnippet,
            folderMount(connect, options.base)
          ];
        }
      },
      livereload: {
        options: {
          port: 9000,
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
      main: {
        options: {
          livereload: true,
          spawn: false
        },
        files: ['js/**/*', 'css/**/*', 'img/**/*', 'partial/**/*', 'service/**/*', 'filter/**/*', 'directive/**/*', 'index.html'],
        tasks: [] //all the tasks are run dynamically during the watch event handler
      }
    },
    jshint: {
      main: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: ['js/**/*.js', 'partial/**/*.js', 'service/**/*.js', 'filter/**/*.js', 'directive/**/*.js']
      }
    },
    clean: {
      before: {
        src: ['dist', 'temp']
      },
      after: {
        src: ['temp']
      }
    },
    less: {
      production: {
        options: {},
        files: {
          'temp/app.css': 'css/app.less'
        }
      }
    },
    ngtemplates: {
      main: {
        options: {
          module: '<%= _.slugify(appname) %>',
          htmlmin: {
            collapseBooleanAttributes: true,
            collapseWhitespace: false,
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
          }
        },
        src: ['partial/**/*.html', 'directive/**/*.html'],
        dest: 'temp/templates.js'
      }
    },
    copy: {
      main: {
        files: [{
          src: [
            'index.html',
            'img/**',
            'bower_components/angular-ui-utils/ui-utils-ieshiv.*',
            'bower_components/bootstrap/dist/fonts/**',
            'bower_components/font-awesome/fonts/**'
          ],
          dest: 'dist/',
          filter: 'isFile',
          expand: true
        }]
      }
    },
    dom_munger: {
      readlibs: {
        options: {
          read: {
            selector: 'script.lib',
            attribute: 'src',
            writeto: 'libjs'
          }
        },
        src: 'index.html'
      },
      readcats: {
        options: {
          read: {
            selector: 'script.cat',
            attribute: 'src',
            writeto: 'catjs'
          }
        },
        src: 'index.html'
      },
      readscripts: {
        options: {
          read: {
            selector: 'script.app',
            attribute: 'src',
            writeto: 'appjs'
          }
        },
        src: 'index.html'
      },
      readcss: {
        options: {
          read: {
            selector: 'link[rel="stylesheet"]',
            attribute: 'href',
            writeto: 'appcss'
          }
        },
        src: 'index.html'
      },
      removescripts: {
        options: {
          remove: 'script'
        },
        src: 'dist/index.html'
      },
      addscript: {
        options: {
          append: {
            selector: 'body',
            html: [
              '<script src="js/lib.min.js"></script>',
              '<script src="js/cat.js"></script>',
              '<script src="js/app.min.js"></script>'
            ].join('')
          }
        },
        src: 'dist/index.html'
      },
      removecss: {
        options: {
          remove: 'link'
        },
        src: 'dist/index.html'
      },
      addcss: {
        options: {
          append: {
            selector: 'head',
            html: '<link rel="stylesheet" href="css/app.min.css">'
          }
        },
        src: 'dist/index.html'
      }
    },
    cssmin: {
      main: {
        src: ['temp/app.css', '<%%= dom_munger.data.appcss %>'],
        dest: 'dist/css/app.min.css'
      }
    },
    concat: {
      lib: {
        src: ['<%%= dom_munger.data.libjs %>'],
        dest: 'dist/js/lib.js'
      },
      cat: {
        src: ['<%%= dom_munger.data.catjs %>'],
        dest: 'dist/js/cat.js'
      },
      main: {
        src: ['<%%= dom_munger.data.appjs %>', '<%%= ngtemplates.main.dest %>'],
        dest: 'dist/js/app.js'
      }
    },
    ngmin: {
      lib: {
        src: 'dist/js/lib.js',
        dest: 'dist/js/lib.js'
      },
      main: {
        src: 'dist/js/app.js',
        dest: 'dist/js/app.js'
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
          sourceMap: 'dist/js/lib.min.js.map',
          sourceMappingURL: 'lib.min.js.map'
        },
        src: 'dist/js/lib.js',
        dest: 'dist/js/lib.min.js'
      },
      main: {
        options: {
          sourceMap: 'dist/js/app.min.js.map',
          sourceMappingURL: 'app.min.js.map'
        },
        src: 'dist/js/app.js',
        dest: 'dist/js/app.min.js'
      }
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
          'dist/index.html': 'dist/index.html'
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
      unit: {
        src: [
          '<%%= dom_munger.data.libjs %>',
          '<%%= dom_munger.data.catjs %>',
          '<%%= dom_munger.data.appjs %>'
        ],
        options: {
          keepRunner: true,
          specs: ['js/**/*-spec.js', 'partial/**/*-spec.js', 'service/**/*-spec.js', 'filter/**/*-spec.js', 'directive/**/*-spec.js']
        }
      }
    }
  });

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
      'readdom',
      'configureProxies',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('readdom', [
    'dom_munger:readlibs',
    'dom_munger:readcats',
    'dom_munger:readscripts',
    'dom_munger:readcss'
  ]);

  grunt.registerTask('build', [
    'jshint',
    'clean:before',
    'less',
    'readdom',
    'ngtemplates',
    'cssmin',
    'concat',
    'ngmin',
    'uglify',
    'copy',
    'dom_munger:removecss',
    'dom_munger:addcss',
    'dom_munger:removescripts',
    'dom_munger:addscript',
    'htmlmin',
    'imagemin',
    'clean:after'
  ]);

  grunt.registerTask('test', function(target) {
    if (target === 'watch') {
      return grunt.task.run(['test', 'watch']);
    }
    grunt.task.run(['jshint', 'readdom', 'jasmine']);
  });

  grunt.registerTask('default', ['build']);

  grunt.event.on('watch', function(action, filepath) {
    //https://github.com/gruntjs/grunt-contrib-watch/issues/156

    if (filepath.lastIndexOf('.js') !== -1 && filepath.lastIndexOf('.js') === filepath.length - 3) {

      //lint the changed js file
      grunt.config('jshint.main.src', filepath);
      grunt.task.run('jshint');

      //find the appropriate unit test for the changed file
      var spec = filepath;
      if (filepath.lastIndexOf('-spec.js') === -1 || filepath.lastIndexOf('-spec.js') !== filepath.length - 8) {
        spec = filepath.substring(0, filepath.length - 3) + '-spec.js';
      }

      //if the spec exists then lets run it
      if (grunt.file.exists(spec)) {
        grunt.config('jasmine.unit.options.specs', spec);
        grunt.task.run('jasmine:unit');
      }
    }

    //if index.html changed, we need to reread the <script> tags so our next run of jasmine
    //will have the correct environment
    if (filepath === 'index.html') {
      grunt.task.run('readdom');
    }

  });

};
