
module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    dirs: {
      test: './test',
      lib: './lib'
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true,
          module: true,
          describe: true,
          beforeEach: true,
          inject: true,
          it: true,
          expect: true,
          FB: true,
          angular: true
        }
      },
      test: {
        src: ['test/**/*.js']
      },
      lib: {
        src: ['lib/**/*.js']
      }
    },
    watch: {
      lib: {
        files: ['<%= dirs.lib %>/**/*.js'],
        tasks: ['jshint:']
      },
      test: {
        files: ['<%= dirs.test %>/**/*.js'],
        tasks: ['jshint:']
      }
    },
    karma: {
      options: {
        configFile: 'karma.conf.coffee',
      },
      ci: {
        autoWatch: false,
        singleRun: true,
        browsers: ['PhantomJS']
      },
      dev: {
        autoWatch: true,
        singleRun: false
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('default', ['jshint']);
};
