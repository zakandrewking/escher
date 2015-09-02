module.exports = function(grunt) {
    // common tasks
    var tasks = ['clean', 'browserify', 'extract_sourcemap', 'uglify'];

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
                    'js/build/escher.js': ['js/src/*.js']
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
        watch: {
            grunt: {
                files: 'Gruntfile.js',
                tasks: tasks
            },
            scripts: {
                files: 'js/src/*.js',
                tasks: tasks
            },
            options: {
                livereload: true
            }
        },
        clean: ['js/build/*.js', 'js/build/*.js.map',
                'js/dist/*.js', 'js/dist/*.js.map']
    });

    // load tasks
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-extract-sourcemap');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // register tasks
    grunt.registerTask('default', tasks);
};
