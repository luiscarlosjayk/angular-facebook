exports.config = {
  multiCapabilities: [{
    'browserName': 'chrome'
  }],
  specs: ['./test/e2e/*.spec.js'],
  baseUrl: 'http://localhost:3333'
};