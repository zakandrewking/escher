var package = require('./package.json')

module.exports = function(grunt) {
  // common tasks
  var tasks = ['cssmin', 'concat', 'browserify', 'extract_sourcemap', 'uglify', 'copy']

  // Project configuration
  grunt.initConfig({
    // css
    cssmin: {
      build: {
        files: {
          'css/build/builder-embed.nomap.min.css': 'css/src/builder-embed.css'
        }
      },
      dist: {
        options: {
          sourceMap: true,
          sourceMapInlineSources: true
        },
        files: {
          'css/dist/builder.min.css': 'css/src/builder.css'
        }
      }

    },
    concat: {
      builder_embed: {
        options: {
          separator: '',
          banner: "module.exports = {'version': '" + package.version + "', builder_embed: '",
          footer: "'};"
        },
        files: {
          'js/src/inline.js': 'css/build/builder-embed.nomap.min.css'
        }
      }
    },
    // js
    browserify: {
      options: {
        browserifyOptions: {
          standalone: 'escher',
          debug: true
        }
      },
      dist: {
        files: {
          'js/build/escher.js': ['js/src/main.js']
        }
      }
    },
    extract_sourcemap: {
      dist: {
        files: {
          'js/dist': 'js/build/escher.js'
        }
      }

    },
    uglify: {
      options: {
        sourceMap: true,
        sourceMapIn: 'js/dist/escher.js.map'
      },
      dist: {
        files: {
          'js/dist/escher.min.js': 'js/dist/escher.js'
        }
      }

    },
    copy: {
      css: {
        src: 'css/src/builder.css',
        dest: 'css/dist/',
        expand: true,
        flatten: true,
      },
      package: {
        src: 'package.json',
        dest: 'py/escher/',
        expand: true,
        flatten: true,
      },
      escher: {
        src: ['js/dist/*', 'css/dist/*'],
        dest: 'py/escher/static/escher/',
        expand: true,
        flatten: true,
      },
      lib: {
        src: [
          'node_modules/bootstrap/dist/js/bootstrap.min.js',
          'node_modules/bootswatch/simplex/bootstrap.min.css',
          'node_modules/bootstrap-slider/dist/css/bootstrap-slider.min.css',
          'node_modules/d3/d3.min.js',
          'node_modules/jquery/dist/jquery.min.js',
        ],
        dest: 'py/escher/static/lib/',
        expand: true,
        flatten: true,
      },
      fonts: {
        src: 'node_modules/bootstrap/dist/fonts/*',
        dest: 'py/escher/static/fonts/',
        expand: true,
        flatten: true,
      },
      jsonschema: {
        src: 'jsonschema/*',
        dest: 'py/escher/static/jsonschema/',
        expand: true,
        flatten: true,
      }
    },
    watch: {
      grunt: {
        files: 'Gruntfile.js',
        tasks: tasks
      },
      scripts: {
        files: 'js/src/*.js',
        tasks: tasks
      },
      package: {
        files: 'package.json',
        tasks: 'copy'
      },
      options: {
        livereload: true
      }
    },
    // testing and coverage
    env: {
      coverage: {
        APP_DIR_FOR_CODE_COVERAGE: '../../coverage/instrument/js/src/'
      }
    },
    instrument: {
      files: 'js/src/*.js',
      options: {
        lazy: true,
        basePath: 'js/src/coverage/instrument/'
      }
    },
    mochaTest: {
      files: 'js/src/tests/*.js'
    },
    storeCoverage: {
      options: {
        dir: 'js/src/coverage/reports'
      }
    },
    makeReport: {
      src: 'js/src/coverage/reports/**/*.json',
      options: {
        type: 'lcov',
        dir: 'js/src/coverage/reports',
        print: 'detail'
      }
    },
    coveralls: {
      src: 'js/src/coverage/reports/lcov.info'
    },
    clean: {
      main: [
        'js/build/', 'js/dist/', 'css/build/', 'css/dist/', 'js/src/inline.js',
        'js/src/coverage/instrument/', 'js/src/coverage/reports/',
        'py/escher/package.json', 'py/escher/static/escher/',
        'py/escher/static/lib/', 'py/escher/static/fonts/',
        'py/escher/static/fonts/',
      ]
    },
    gitadd: '*',
    gitpush: {
      tracking_tags: {
        options: {
          tags: true
        }
      },
      tracking: {
        options: {
          tags: false
        }
      }
    },
    release: {
      // bump the version and commit, but do not push anything
      options: {
        beforeRelease: [...tasks, 'gitadd'],
        tagName: 'v<%= version %>',
        push: false,
        pushTags: false,
        npm: false
      }
    },
    shell: {
      // publish to npm and pypi
      npm: {
        command: 'npm publish'
      },
      pypi: {
        command: 'cd py && python setup.py sdist bdist_wheel --universal upload'
      }
    }
  })

  // basics
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-copy')
  // css
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-contrib-concat')
  // js
  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-extract-sourcemap')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  // testing and coverage
  grunt.loadNpmTasks('grunt-mocha-test')
  grunt.loadNpmTasks('grunt-istanbul')
  grunt.loadNpmTasks('grunt-env')
  grunt.loadNpmTasks('grunt-coveralls')
  // release
  grunt.loadNpmTasks('grunt-git');
  grunt.loadNpmTasks('grunt-release')
  grunt.loadNpmTasks('grunt-shell')

  // register tasks
  grunt.registerTask('default', tasks)
  grunt.registerTask('test', ['mochaTest'])
  grunt.registerTask('coverage', ['env:coverage', 'instrument', 'mochaTest',
                                  'storeCoverage', 'makeReport', 'coveralls'])
  grunt.registerTask('publish', ['gitpush', ...tasks, 'shell:npm', 'shell:pypi'])
}
