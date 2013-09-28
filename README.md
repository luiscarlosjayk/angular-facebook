Angularjs-Facebook
==================

An AngularJS module to take approach of the [Facebook Javascript SDK](https://developers.facebook.com/docs/reference/javascript/).

Demo
----
You can find a sample usage [in this demo](http://plnkr.co/edit/dDAmvdCibv46ULfgKCd3?p=preview). :+1

Install
-----

install with bower

    bower install angularjs-facebook

or download the [master.zip](https://github.com/Ciul/Angularjs-Facebook/archive/master.zip)

Usage
---

You first have to declare dependency of ```Facebook``` module inside your app module (perhaps inside your app main module).
Then you need to configure the Facebook module using the 'FacebookProvider':
  
    // Code below
    angular.module('MyApp', ['Facebook'])
    
    .config([
      'FacebookProvider',
      '$routeProvider',
      function(FacebookProvider, $routeProvider) {
        
        // Define your routes through $routeProvider and else...
        
        /**
         * Here you could set your appId throug the setAppId method and then initialize
         * or use the shortcut in the initialize method directly.
         */
         FacebookProvider.init('my-ap-id');
        
      }
    ])
    
    .controller('AnyController', [
      '$scope',
      'Facebook', // Don't forget to inject the Facebook Service :D
      function($scope, Facebook) {
        
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
            switch (response.status) {
              case 'connected':
                // He is logged
                $scope.$apply(function() {
                  $scope.loggedIn = true;
                });
                break;
              default:
                $scope.$apply(function() {
                  $scope.loggedIn = false;
                });
            }
          }
        };
        
        $scope.me = function() {
          Facebook.api('/me', function(response) {
            $scope.$apply(function() {
              $scope.user = response; // Here you could re-check for user status just in case...
            });
          });
        };
      }
    ]);
    
## Test

First install the dependencies with npm: `npm install`

- **production**: `npm test` (single run / PhantomJS)
- **development**: `karma start` (file watch / Chrome)
