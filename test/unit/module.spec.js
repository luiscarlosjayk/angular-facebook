describe('Module: Facebook', function () {

  var $window;

  beforeEach(module('facebook'));

  beforeEach(function () {
    inject(function (_$window_) {
      $window = _$window_;
    });

    $window = {
      document: $window.document,
      location: {
        protocol: 'file:'
      }
    };
  });

  it('should append http: to the file url when using file protocol', function(done) {
    var element = $window.document.getElementsByTagName('head')[0].lastChild;

    expect(element.src.substr(0, 5)).toBe('http:');
    done();
  });
});
