// JavaScript
describe('Service: facebook', function () {
  var facebook, facebookProvider;

  beforeEach(function () {
    // Load the service's module
    module('facebook', function (_FacebookProvider_) {
      facebookProvider = _FacebookProvider_;
    });

    inject(function (_Facebook_) {
      facebook = _Facebook_;
    });
  });

  it('should exist', function () {
    expect(!!facebookProvider).toBe(true);
  });

  describe('the provider api should provide', function () {

    it('appId as default value', function () {
      expect(facebookProvider.getAppId()).toBe(null);
    });
    it('working getter / setter for appId', function () {
      facebookProvider.setAppId(123456789101112);
      expect(facebookProvider.getAppId()).toBe(123456789101112);
    });

    it('locale as default value', function () {
      expect(facebookProvider.getLocale()).toBe('en_US');
    });
    it('working getter / setter for locale', function () {
      facebookProvider.setLocale('de_DE');
      expect(facebookProvider.getLocale()).toBe('de_DE');
    });

    it('status as default value', function () {
      expect(facebookProvider.getStatus()).toBe(true);
    });
    it('working getter / setter for status', function () {
      facebookProvider.setStatus(false);
      expect(facebookProvider.getStatus()).toBe(false);
    });

    it('channel as default value', function () {
      expect(facebookProvider.getChannel()).toBe(null);
    });
    it('working getter / setter for channel', function () {
      facebookProvider.setChannel('//WWW.YOUR_DOMAIN.COM/channel.html');
      expect(facebookProvider.getChannel()).toBe('//WWW.YOUR_DOMAIN.COM/channel.html');
    });

    it('cookie as default value', function () {
      expect(facebookProvider.getCookie()).toBe(true);
    });
    it('working getter / setter for cookie', function () {
      facebookProvider.setCookie(false);
      expect(facebookProvider.getCookie()).toBe(false);
    });

    it('xfbml as default value', function () {
      expect(facebookProvider.getXfbml()).toBe(true);
    });
    it('working getter / setter for xfbml', function () {
      facebookProvider.setXfbml(false);
      expect(facebookProvider.getXfbml()).toBe(false);
    });

    it('authResponse as default value', function () {
      expect(facebookProvider.getAuthResponse()).toBe(true);
    });
    it('working getter / setter for authResponse', function () {
      var obj = {};
      facebookProvider.setAuthResponse(obj);
      expect(facebookProvider.getAuthResponse()).toBe(obj);
    });

    it('FrictionlessRequests as default value', function () {
      expect(facebookProvider.getFrictionlessRequests()).toBe(false);
    });
    it('working getter / setter for FrictionlessRequests', function () {
      var obj = {};
      facebookProvider.setFrictionlessRequests(obj);
      expect(facebookProvider.getFrictionlessRequests()).toBe(obj);
    });

    it('HideFlashCallback as default value', function () {
      expect(facebookProvider.getHideFlashCallback()).toBe(null);
    });
    it('working getter / setter for HideFlashCallback', function () {
      var obj = {};
      facebookProvider.setHideFlashCallback(obj);
      expect(facebookProvider.getHideFlashCallback()).toBe(obj);
    });

    it('working setInitCustomOption', function () {
      expect(facebookProvider.setInitCustomOption(null, null)).toBe(false);
      expect(facebookProvider.setInitCustomOption('key', null)).toBe(null);
    });


    it('working getInitOption', function () {
      var obj = { anotherSomeKey: true };
      facebookProvider.setInitCustomOption('someKey', obj);
      expect(facebookProvider.getInitOption('someKey')).toBe(obj);
      expect(facebookProvider.getInitOption()).toBe(false);
    });

  });
});