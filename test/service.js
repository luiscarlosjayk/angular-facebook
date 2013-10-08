describe('Service: NgFacebook', function () {
  var fb;

  beforeEach(function () {
    // Load the service's module
    module('facebook');

    inject(function (Facebook) {
      fb = Facebook;
    });
  });

  it('should exist', function () {
    expect(!!fb).toBe(true);
  });
});