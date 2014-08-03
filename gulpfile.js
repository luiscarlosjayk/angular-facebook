var gulp = require('gulp');
var gutil = require('gulp-util');
var watch = require('gulp-watch');

var connect = require('gulp-connect');

var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

var karma = require('karma').server;
var path = require('path');

var karmaConf = require('./karma.conf');

var karma = require('karma');
var karmaParseConfig = require('karma/lib/config').parseConfig;

function runKarma(configFilePath, options, cb) {

  configFilePath = path.resolve(configFilePath);

  var server = karma.server;
  var log = gutil.log;
  var colors = gutil.colors;
  var config = karmaParseConfig(configFilePath, {});

  Object.keys(options).forEach(function(key) {
    config[key] = options[key];
  });

  server.start(config, function(exitCode) {
    log('Karma has exited with ' + colors.red(exitCode));
    cb();
    process.exit(exitCode);
  });
}

gulp.task('lint', function() {
  return gulp.src([
      './lib/**/*.js',
      './test/**/*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('watch', function () {
  gulp.watch([
    './lib/**/*.js',
    './test/**/*.js'
  ], ['lint']);
  gulp.run('test-dev');
});

gulp.task('test', function(cb) {
  runKarma('karma.conf.js', {
    autoWatch: false,
    singleRun: true,
    browsers: ['PhantomJS']
  }, cb);
});

gulp.task('test-dev', function(cb) {
  runKarma('karma.conf.js', {
    autoWatch: true,
    singleRun: false
  }, cb);
});

gulp.task('prepare-testapp', function () {
  gulp.src([
    './bower_components/**',
    './lib/**',
  ], {
    base: '.'
  }).pipe(gulp.dest('./testapp'));

  connect.server({
    root: 'testapp',
    port: 3333
  });
})

gulp.task('default', function() {
  gulp.start('lint');
});