module.exports = function(grunt) {
    // common tasks
    var tasks = ['browserify', 'extract_sourcemap', 'uglify', 'copy'];

    // Project configuration
    grunt.initConfig({
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
                sourceMapIn: 'js/dist/escher.js.map',
                preserveComments: 'some'
            },
            dist: {
                files: {
                    'js/dist/escher.min.js': 'js/dist/escher.js'
                }
            }

        },
        copy: {
            package: {
                src: 'package.json',
                dest: 'py/escher/',
                expand: true,
                flatten: true
            },
            escher: {
                src: ['js/dist/*', 'css/*'],
                dest: 'py/escher/static/escher/',
                expand: true,
                flatten: true
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
        clean: [
            'js/build/*.js', 'js/build/*.js.map',
            'js/dist/*.js', 'js/dist/*.js.map',
            'js/src/coverage/instrument/*', 'js/src/coverage/reports/*',
            'py/escher/package.json', 'py/escher/static/escher/*'
        ]
    });

    // basics
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    // js
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-extract-sourcemap');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // testing and coverage
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-istanbul');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-coveralls');

    // register tasks
    grunt.registerTask('default', tasks);
    grunt.registerTask('test', ['mochaTest']);
    grunt.registerTask('coverage', ['env:coverage', 'instrument', 'mochaTest',
                                    'storeCoverage', 'makeReport', 'coveralls']);
};
