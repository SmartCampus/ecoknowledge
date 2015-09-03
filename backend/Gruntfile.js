module.exports = function (grunt) {
    'use strict';

    // load extern tasks
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-mocha-test');


    // tasks
    grunt.initConfig({

// ---------------------------------------------
//                          build and dist tasks
// ---------------------------------------------

        typescript: {
            build: {
                src: [
                    'src/**/*.ts'
                ],
                dest: 'build/',
                options: {
                    module: 'commonjs',
                    basePath: 'src'
                }
            },

            dist: {
                src: [
                    'src/**/*.ts'
                ],
                dest: 'dist/',
                options: {
                    module: 'commonjs',
                    basePath: 'src'
                }
            },

            test: {
                src: [
                    'tests/**/*.ts'
                ],
                dest: 'buildTests/',
                options: {
                    module: 'commonjs'
                }
            }
        },

        express: {
            options: {
                port: 4000
            },
            build: {
                options: {
                    script: 'build/Backend.js'
                }
            },
            dist: {
                options: {
                    script: 'dist/Backend.js',
                    node_env: 'production'
                }
            }
        },
// ---------------------------------------------

// ---------------------------------------------
//                                 develop tasks
// ---------------------------------------------
        watch: {
            express: {
                files:  [ 'build/Backend.js' ],
                tasks:  [ 'express:build' ],
                options: {
                    spawn: false
                }
            },

            developServer: {
                files: ['src/**/*.ts'],
                tasks: ['typescript:build']
            }
        },
// ---------------------------------------------

// ---------------------------------------------
//                                 test tasks
// ---------------------------------------------
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    colors: true
                },
                src: ['buildTests/**/*.js']
            }
        },
// ---------------------------------------------

// ---------------------------------------------
//                                    clean task
// ---------------------------------------------
        clean: {
            build: ['build/'],
            dist: ['dist/'],
            test: ['buildTests/'],
            all:['src/**/*.js', 'src/**/*js.map','tests/**/*.js', 'tests/**/*js.map']
        },
// ---------------------------------------------


// ---------------------------------------------
//                                    copy task
// ---------------------------------------------
        copy: {
            testFiles: {
                files: [{
                    expand: true,
                    src: ['db_test.json', 'stub_values_test.json', 'db.json', 'stub_values.json'],
                    dest: 'buildTests/'
                }]
            },
            prodFiles: {
                files: [{
                    expand: true,
                    src: ['db_test.json', 'stub_values_test.json', 'db.json', 'stub_values.json'],
                    dest: 'build/'
                }]
            }
        }
    });

    // register tasks
    grunt.registerTask('default', ['build']);

    grunt.registerTask('build', function () {
        grunt.task.run(['clean:build','clean:test']);

        grunt.task.run(['typescript:build','typescript:test', 'copy:prodFiles']);
        //grunt.task.run(['typescript:build']);
    });

    grunt.registerTask('develop', function() {
        grunt.task.run(['build', 'express:build', 'watch']);
    });

    grunt.registerTask('dist', function () {
        grunt.task.run(['clean:dist']);

        grunt.task.run(['typescript:dist']);
    });

    grunt.registerTask('test', function() {
        grunt.task.run(['clean:test']);

        grunt.task.run(['copy:testFiles','typescript:test', 'mochaTest:test']);
    });

}