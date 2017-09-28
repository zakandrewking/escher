const webpackConfig = require('./webpack.config')
const escherPackage = require('./package.json')

module.exports = function (grunt) {
  const build = ['clean', 'cssmin', 'babel', 'concat', 'copy:css']
  const bundle = [...build, 'webpack', 'uglify', 'copy']

  // Project configuration
  grunt.initConfig({
    // CSS
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
          banner: "module.exports = {'version': '" + escherPackage.version + "', builder_embed: '",
          footer: "'};"
        },
        files: {
          'js/lib/inline.js': 'css/build/builder-embed.nomap.min.css'
        }
      }
    },

    // Babel
    babel: {
      options: {
        sourceMap: true
      },
      files: {
        expand: true,
        cwd: 'js/src',
        src: ['**/*.js', '**/*.jsx'],
        dest: 'js/lib',
        ext: '.js'
      }
    },

    watch: {
      scripts: {
        files: ['js/src/*.js', 'js/src/*.jsx'],
        tasks: ['babel']
      }
    },

    webpack: {
      prod: webpackConfig
    },

    uglify: {
      options: {
        sourceMap: true,
        sourceMapIn: 'js/dist/escher.js.map'
      },
      dist: {
        files: {'js/dist/escher.min.js': 'js/dist/escher.js'}
      }
    },

    clean: {
      files: [
        'js/lib/tests/helpers', 'js/lib/tests', 'js/lib/', 'js/dist/',
        'css/build/', 'css/dist/', 'js/lib/coverage/instrument/',
        'js/lib/coverage/reports/', 'py/escher/package.json',
        'py/escher/static/escher/', 'py/escher/static/lib/',
        'py/escher/static/fonts/', 'py/escher/static/fonts/'
      ]
    },

    copy: {
      css: {
        src: 'css/src/builder.css',
        dest: 'css/dist/',
        expand: true,
        flatten: true
      },
      package: {
        src: 'package.json',
        dest: 'py/escher/',
        expand: true,
        flatten: true
      },
      escher: {
        src: [ 'js/dist/*', 'css/dist/*' ],
        dest: 'py/escher/static/escher/',
        expand: true,
        flatten: true
      },
      jsonschema: {
        src: 'jsonschema/*',
        dest: 'py/escher/static/jsonschema/',
        expand: true,
        flatten: true
      }
    },

    env: {
      coverage: {
        APP_DIR_FOR_CODE_COVERAGE: '../../coverage/instrument/js/lib/'
      }
    },

    instrument: {
      files: 'js/lib/*.js',
      options: {
        lazy: true,
        basePath: 'js/lib/coverage/instrument/'
      }
    },

    mochaTest: {
      files: 'js/lib/tests/*.js',
      options: {
        require: 'ignore-styles'
      }
    },

    storeCoverage: {
      options: {
        dir: 'js/lib/coverage/reports'
      }
    },

    makeReport: {
      src: 'js/lib/coverage/reports/**/*.json',
      options: {
        type: 'lcov',
        dir: 'js/lib/coverage/reports',
        print: 'detail'
      }
    },

    coveralls: {
      src: 'js/lib/coverage/reports/lcov.info'
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
        beforeRelease: [...bundle, 'gitadd'],
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
        command: 'cd py && python setup.py sdist bdist_wheel --universal upload -r pypi'
      }
    }
  })

  // Extensions
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-babel')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-webpack')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-mocha-test')
  grunt.loadNpmTasks('grunt-istanbul')
  grunt.loadNpmTasks('grunt-env')
  grunt.loadNpmTasks('grunt-coveralls')
  grunt.loadNpmTasks('grunt-git')
  grunt.loadNpmTasks('grunt-release')
  grunt.loadNpmTasks('grunt-shell')

  // Register tasks
  grunt.registerTask('build', build)
  grunt.registerTask('buildw', [...build, 'watch'])
  grunt.registerTask('bundle', bundle)
  grunt.registerTask('test', [...build, 'mochaTest'])
  grunt.registerTask('coverage', [
    'env:coverage', 'instrument', 'mochaTest',
    'storeCoverage', 'makeReport', 'coveralls'
  ])
  grunt.registerTask('publish', [
    'gitpush', ...bundle, 'shell:npm', 'shell:pypi'
  ])
}
