Angular-Facebook
==================

[![Build Status](https://travis-ci.org/Ciul/angular-facebook.png?branch=master)](https://travis-ci.org/Ciul/angular-facebook) 
[![Dependency Status](https://david-dm.org/Ciul/angular-facebook.png)](https://david-dm.org/Ciul/angular-facebook) 
[![devDependency Status](https://david-dm.org/Ciul/angular-facebook/dev-status.png)](https://david-dm.org/Ciul/angular-facebook#info=devDependencies)

An AngularJS module based approach to the [Facebook Javascript SDK](https://developers.facebook.com/docs/reference/javascript/).

## Demo

[Sample application](http://plnkr.co/edit/dDAmvdCibv46ULfgKCd3?p=preview).

## Install

install with bower
```bash
bower install angular-facebook
```
or download the [master.zip](https://github.com/Ciul/angular-facebook/archive/master.zip)

## Usage

You first have to declare the ```facebook``` module dependency inside your app module (perhaps inside your app main module).
Then you need to configure the facebook module using the 'FacebookProvider':

```javascript
angular.module('app', ['facebook'])

  .config(function(FacebookProvider) {
     // Set your appId through the setAppId method or
     // use the shortcut in the initialize method directly.
     FacebookProvider.init('YOUR_APP_ID');
  })

  .controller('authenticationCtrl', function($scope, Facebook) {

    $scope.login = function() {
      // From now on you can use the Facebook service just as Facebook api says
      Facebook.login(function(response) {
        // Do something with response.
      });
    };

    $scope.getLoginStatus = function() {
      Facebook.getLoginStatus(function(response) {
        if(response.status === 'connected') {
          $scope.loggedIn = true;
        } else {
          $scope.loggedIn = false;
        }
      });
    };

    $scope.me = function() {
      Facebook.api('/me', function(response) {
        $scope.user = response;
      });
    };
  });
```

You can use the `isReady` function to get notified when the Facebook SDK is ready

```javascript
$scope.$watch(function() {
  // This is for convenience, to notify if Facebook is loaded and ready to go.
  return Facebook.isReady();
}, function(newVal) {
  // You might want to use this to disable/show/hide buttons and else
  $scope.facebookReady = true;
});
```

Development
-------------

Install all dependencies and use gulp to watch the tests

```
# Install node.js dependencies
npm install

# Install bower components
bower install

# Run karma tests
gulp watch
```

To run protractor tests you need to install protractor first. ([Protractor Setup](https://github.com/angular/protractor/blob/master/docs/tutorial.md#setup))

```
# Prepare the testapp
gulp prepare-testapp

# Run protractor tests
protractor protractor.config.js
```
