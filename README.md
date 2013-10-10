Angular-Facebook
==================

[![Build Status](https://travis-ci.org/Ciul/angular-facebook.png)](https://travis-ci.org/Ciul/angular-facebook) 
[![Dependency Status](https://david-dm.org/Ciul/angular-facebook.png)](https://david-dm.org/Ciul/angular-facebook) 

An AngularJS module to take approach of the [Facebook Javascript SDK](https://developers.facebook.com/docs/reference/javascript/).

## Demo

You can find a sample usage [in this demo](http://plnkr.co/edit/dDAmvdCibv46ULfgKCd3?p=preview).

## Install

install with bower

    bower install angular-facebook

or download the [master.zip](https://github.com/Ciul/angular-facebook/archive/master.zip)

## Usage

You first have to declare dependency of ```facebook``` module inside your app module (perhaps inside your app main module).
Then you need to configure the facebook module using the 'FacebookProvider':

```javascript
var app = angular.module('app', ['facebook']); // inject facebook module

app.config(['FacebookProvider', function(FacebookProvider) {
     // Here you could set your appId throug the setAppId method and then initialize
     // or use the shortcut in the initialize method directly.
     FacebookProvider.init('my-ap-id');
}])

app.controller('authenticationCtrl', ['$scope', 'Facebook', function($scope, Facebook) {

  // Here, usually you should watch for when Facebook is ready and loaded
  $watch(function() {
    return Facebook.isReady(); // This is for convenience, to notify if Facebook is loaded and ready to go.
  }, function(newVal) {
    $scope.facebookReady = true; // You might want to use this to disable/show/hide buttons and else
  });
  
  // From now and on you can use the Facebook service just as Facebook api says
  // Take into account that you will need $scope.$apply when being inside Facebook functions scope and not angular
  $scope.login = function() {
    Facebook.login(function(response) {
      // Do something with response. Don't forget here you are on Facebook scope so use $scope.$apply
    });
  };
  
  $scope.getLoginStatus = function() {
    Facebook.getLoginStatus(response) {
      if(response.status == 'connected')
        $scope.$apply(function() {
          $scope.loggedIn = true;
        });
      } else {
        $scope.$apply(function() {
          $scope.loggedIn = false;
        });
      }
    };

    $scope.me = function() {
      Facebook.api('/me', function(response) {
        $scope.$apply(function() {
          // Here you could re-check for user status (just in case)
          $scope.user = response;
        });
      });
    };
}]);
```

## Running Test

First install the dependencies with npm: `npm install`

Run the tests with `grunt karma:dev` (file watch / Chrome)