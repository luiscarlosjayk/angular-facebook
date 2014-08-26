module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'lib/angular-facebook.js',
      'lib/angular-facebook-phonegap.js',
      'test/unit/*.spec.js'
    ],
    preprocessors: {
      'lib/*.js': ['coverage']
    },
    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },
    exclude: [],
    port: 8080,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    reporters: ['progress', 'dots', 'coverage'],
    browsers: ['Chrome'],
    singleRun: false
  });
};
