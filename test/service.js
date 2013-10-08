describe('Service: NgFacebook', function () {
  var fb;

  beforeEach(function () {
    // Load the service's module
    module('facebook');

    inject(function (facebook) {
      fb = facebook;
    });
  });

  it('should exist', function () {
    expect(!!fb).toBe(true);
  });
});