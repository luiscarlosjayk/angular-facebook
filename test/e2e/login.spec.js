/* jshint unused:false */

describe('testapp', function() {

  var ptor = protractor.getInstance();

  it('should open a popup when hitting the login btn and authenticate successfully', function() {

    browser.get('/');

    // open facebook login popup
    element(by.id('login')).click();

    // wait for opening login popup
    browser.sleep(1000);

    // get all popups
    var handlesPromise = ptor.getAllWindowHandles();
    var handlesForLaterUse;

    var errorCb = function (err) {
      console.log(err);
    };

    handlesPromise
      .then(function(handles) {
        handlesForLaterUse = handles;
        // switch to login popup window
        return ptor.switchTo().window(handles[1]);
      }).then(function(handle) {
        // the test user used here is already authenticated with the testapp
        // so there is no confirmation needed
        browser.driver.findElement(by.id('email')).sendKeys('angular_fpbolth_user@tfbnw.net');
        browser.driver.findElement(by.id('pass')).sendKeys('12345');
        return browser.driver.findElement(by.id('loginbutton')).click();
      }, errorCb).then(function() {
        // switch back to first window
        return ptor.switchTo().window(handlesForLaterUse[0]);
      }, errorCb).then(function () {
        return expect(browser.driver.findElement(by.id('status')).getText()).toBe('yes');
      });
  });

  it('should use authenticated api call and show user data', function () {
    // open facebook login popup
    element(by.id('api')).click();
    browser.sleep(1000);
    expect(browser.driver.findElement(by.id('api_first_name')).getText()).toBe('angular');
  });
});