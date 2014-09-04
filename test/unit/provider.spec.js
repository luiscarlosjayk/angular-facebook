describe('Provider: facebookProvider', function () {
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

  describe('the provider api should', function () {

    var provideTxt = 'provide a getter / setter including the right default value for: ';

    it(provideTxt + '`appId`', function () {
      expect(facebookProvider.getAppId()).toBe(null);

      facebookProvider.setAppId(123456789101112);
      expect(facebookProvider.getAppId()).toBe(123456789101112);
    });

    it(provideTxt + 'loadSDK`', function () {
      expect(facebookProvider.getLoadSDK()).toBe(undefined);

      facebookProvider.setLoadSDK(false);
      expect(facebookProvider.getLoadSDK()).toBe(false);
    });

    it(provideTxt + 'sdkVersion`', function () {
      expect(facebookProvider.getSdkVersion()).toBe('v2.0');
      facebookProvider.setSdkVersion('v1.0');
      expect(facebookProvider.getSdkVersion()).toBe('v1.0');
    });

    it(provideTxt + 'locale`', function () {
      expect(facebookProvider.getLocale()).toBe('en_US');

      facebookProvider.setLocale('de_DE');
      expect(facebookProvider.getLocale()).toBe('de_DE');
    });

    it(provideTxt + 'status`', function () {
      expect(facebookProvider.getStatus()).toBe(true);

      facebookProvider.setStatus(false);
      expect(facebookProvider.getStatus()).toBe(false);
    });

    it(provideTxt + 'channel`', function () {
      expect(facebookProvider.getChannel()).toBe(null);

      facebookProvider.setChannel('//WWW.YOUR_DOMAIN.COM/channel.html');
      expect(facebookProvider.getChannel()).toBe('//WWW.YOUR_DOMAIN.COM/channel.html');
    });

    it(provideTxt + 'cookie`', function () {
      expect(facebookProvider.getCookie()).toBe(true);

      facebookProvider.setCookie(false);
      expect(facebookProvider.getCookie()).toBe(false);
    });

    it(provideTxt + 'xfbml`', function () {
      expect(facebookProvider.getXfbml()).toBe(true);

      facebookProvider.setXfbml(false);
      expect(facebookProvider.getXfbml()).toBe(false);
    });

    it(provideTxt + 'authResponse`', function () {
      expect(facebookProvider.getAuthResponse()).toBe(undefined);

      var obj = { a: 1 };
      facebookProvider.setAuthResponse(obj);
      expect(facebookProvider.getAuthResponse()).toBe(obj);

      // todo(mrzmyr): review
      facebookProvider.setAuthResponse(false);
      expect(facebookProvider.getAuthResponse()).toBe(true);
    });

    it(provideTxt + 'FrictionlessRequests`', function () {
      expect(facebookProvider.getFrictionlessRequests()).toBe(false);

      var obj = { b: 2 };
      facebookProvider.setFrictionlessRequests(obj);
      expect(facebookProvider.getFrictionlessRequests()).toBe(obj);
    });

    it(provideTxt + 'HideFlashCallback`', function () {
      expect(facebookProvider.getHideFlashCallback()).toBe(null);

      var obj = { c: 3 };
      facebookProvider.setHideFlashCallback(obj);
      expect(facebookProvider.getHideFlashCallback()).toBe(obj);

      // todo(mrzmyr): review
      facebookProvider.setHideFlashCallback(false);
      expect(facebookProvider.getHideFlashCallback()).toBe(null);
    });

    it('provide a working setInitCustomOption method', function () {
      expect(facebookProvider.setInitCustomOption(null, null)).toBe(false);
      expect(facebookProvider.setInitCustomOption('key', null)).toBe(null);
    });

    it('provide a working getInitOption method', function () {
      var obj = { anotherSomeKey: true };
      facebookProvider.setInitCustomOption('someKey', obj);
      expect(facebookProvider.getInitOption('someKey')).toBe(obj);
      expect(facebookProvider.getInitOption()).toBe(false);
    });

    it('consume the appId in the init method as normal string', function () {
      facebookProvider.init('1234567');
      expect(facebookProvider.getInitOption('appId')).toBe('1234567');
    });

    it('consume the appId in the init method as number', function () {
      facebookProvider.init(1234567);
      expect(facebookProvider.getInitOption('appId')).toBe('1234567');
    });

    it('consume the appId in the init method as object', function () {
      facebookProvider.init({
        appId: '123456'
      });
      expect(facebookProvider.getInitOption('appId')).toBe('123456');
    });

    it('define to load the sdk or not in the init method', function () {
      facebookProvider.init({
        appId: '123456'
      }, false);
      expect(facebookProvider.getInitOption('loadSDK')).toBe(false);
    });

    // todo(mrzmyr): is this ready useful ?
    it('use the previous set appId if using the init mehtod twice', function () {
      facebookProvider.setInitCustomOption('appId', '123');
      expect(facebookProvider.getInitOption('appId')).toBe('123');
      facebookProvider.init(undefined);
      expect(facebookProvider.getInitOption('appId')).toBe('123');
    });
  });
});
