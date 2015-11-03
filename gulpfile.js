/* global process, require */

var gulp = require('gulp');
var gutil = require('gulp-util');

var connect = require('gulp-connect');

var rename = require("gulp-rename");
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');

var Server = require('karma').Server;
var path = require('path');

var karma = require('karma');
var karmaParseConfig = require('karma/lib/config').parseConfig;

function runKarma(configFilePath, options, cb) {

  configFilePath = path.resolve(configFilePath);

  var log = gutil.log;
  var colors = gutil.colors;
  var config = karmaParseConfig(configFilePath, {});

  Object.keys(options).forEach(function(key) {
    config[key] = options[key];
  });

  new Server(config, function(exitCode) {
    log('Karma has exited with ' + colors.red(exitCode));
    cb();
    process.exit(exitCode);
  }).start();
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
    './test/**/*.js',
    './gulpfile.js'
  ], ['lint']);

  gulp.start('test-dev');
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
});

gulp.task('distribute', function() {
  gulp
    .src('./lib/*.js')
    .pipe(gulp.dest('./dist'));

  gulp
    .src('lib/angular-facebook.js')
    .pipe(uglify())
    .pipe(rename('angular-facebook.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', function() {
  gulp.start('lint');
  gulp.start('distribute');
});