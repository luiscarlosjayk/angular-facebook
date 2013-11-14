/*
---
name: Facebook Angularjs

description: Provides an easier way to make use of Facebook API with Angularjs

license: MIT-style license

authors:
  - Ciul

requires: [angular]
provides: [facebook]

...
*/
(function(window, angular, undefined) {
  'use strict';
  
  // Module global settings.
  var settings = {};
  
  // Module global flags.
  var flags = {
    sdk:        false,
    ready:      false
  };
  
  // Module global loadDeferred
  var loadDeferred;
  
  /**
   * Facebook module
   */
  angular.module('facebook', []).
    
    /**
     * Facebook provider
     */
    provider('Facebook', [
      function() {
        
        /**
         * Facebook appId
         * @type {Number}
         */
        settings.appId = null;
        
        this.setAppId = function(appId) {
          settings.appId = appId;
        };
        
        this.getAppId = function() {
          return settings.appId;
        };
        
        /**
         * Locale language, english by default
         * @type {String}
         */
        settings.locale = 'en_US';

        this.setLocale = function(locale) {
          settings.locale = locale;
        };

        this.getLocale = function() {
          return settings.locale;
        };
        
        /**
         * Set if you want to check the authentication status 
         * at the start up of the app 
         * @type {Boolean}
         */
        settings.status = true;

        this.setStatus = function(status) {
          settings.status = status;
        };

        this.getStatus = function() {
          return settings.status;
        };
        
        /**
         * Adding a Channel File improves the performance of the javascript SDK, 
         * by addressing issues with cross-domain communication in certain browsers.
         * @type {String}
         */
        settings.channelUrl = null;

        this.setChannel = function(channel) {
          settings.channelUrl = channel;
        };

        this.getChannel = function() {
          return settings.channelUrl;
        };
        
        /**
         * Enable cookies to allow the server to access the session
         * @type {Boolean}
         */
        settings.cookie = true;

        this.setCookie = function(cookie) {
          settings.cookie = cookie;
        };

        this.getCookie = function() {
          return settings.cookie;
        };
        
        /**
         * Parse XFBML
         * @type {Boolean}
         */
        settings.xfbml = true;

        this.setXfbml = function(enable) {
          settings.xfbml = enable;
        };

        this.getXfbml = function() {
          return settings.xfbml;
        };
        
        /**
         * Auth Response
         * @type {Object}
         */
        settings.authResponse = true;

        this.setAuthResponse = function(obj) {
          obj = obj || true;
          settings.authResponse = obj;
        };

        this.getAuthResponse = function() {
          return settings.authResponse;
        };
        
        /**
         * Frictionless Requests
         * @type {Boolean}
         */
        settings.frictionlessRequests = false;

        this.setFrictionlessRequests = function(enable) {
          settings.frictionlessRequests = enable;
        };

        this.getFrictionlessRequests = function() {
          return settings.frictionlessRequests;
        };
        
        /**
         * HideFlashCallback
         * @type {Object}
         */
        settings.hideFlashCallback = null;

        this.setHideFlashCallback = function(obj) {
          obj = obj || null;
          settings.hideFlashCallback = obj;
        };

        this.getHideFlashCallback = function() {
          return settings.hideFlashCallback;
        };
        
        /**
         * Custom option setting
         * optionName @type {String}
         * value      @type {*}
         */
        this.setInitCustomOption = function(optionName, value) {
          if (!angular.isString(optionName))
            return;
          
          settings[optionName] = value;
        };
        
        this.getInitOption = function(optionName) {
          if (!angular.isString(optionName)) // If optionName is not String then return
            return;
          
          if (!settings.hasOwnProperty[optionName]) // If non existing optionName then return
            return;
          
          return settings[optionName];
        };
        
        /**
         * Init Facebook API required stuff
         * This will prepare the app earlier (on settingsuration)
         */
        this.init = function(initSettings) {
          // If string is passed, set it as appId
          if (angular.isString(initSettings))
            settings.appId = initSettings || settings.appId;
          
          // If object is passed, merge it with app settings
          if (angular.isObject(initSettings))
            angular.extend(settings, initSettings);
        };
        
        /**
         * This defined the Facebook service
         */
        this.$get = [
          '$q',
          '$rootScope',
          '$timeout',
          '$window',
          function($q, $rootScope, $timeout, $window) {
            /**
             * This is the NgFacebook class to be retrieved on Facebook Service request.
             */
            function NgFacebook() {
              this.appId = settings.appId;
            }
            
            /**
             * Ready state method
             * @return {Boolean}
             */
            NgFacebook.prototype.isReady = function() {
              return flags.ready;
            };
            
            (function() {
            
              var d = $q.defer();
              NgFacebook.prototype.test = function() {
                
                loadDeferred.promise.then(function() {
                  console.log('do something');
                  
                  d.resolve(2);
                });
                
                return d.promise;
              };
              
            })();
            
            /**
             * Map some asynchronous Facebook sdk methods to NgFacebook
             */
            angular.forEach([
              'login',
              'logout',
              'api',
              'ui',
              'getLoginStatus'
            ], function(name) {
              NgFacebook.prototype[name] = function() {
                // Create deferred
                var d = $q.defer();
                
                // Get arguments passed into an array
                var args = Array.prototype.slice.call(arguments);
                
                // Get user function if any is given as last argument
                var userFn;
                if (angular.isFunction(args[args.length-1]))
                  userFn = args.pop();
                
                // Append our custom function into arguments array
                args.push(function(response) {
                  $timeout(function() {
                    if (angular.isUndefined(response.error)) {
                      // Success
                      d.resolve(response);
                    } else {
                      // Error
                      d.reject(response);
                    }
                    
                    // Call user function and pass response
                    if (angular.isFunction(userFn))
                      userFn(response);
                  });
                });
                
                $timeout(function() {
                  // Call when loadDeferred be resolved, meaning Service is ready to be used
                  loadDeferred.promise.then(
                    function() {
                      $window.FB[name].apply(FB, args);
                    },
                    function() {
                      throw 'Facebook API could not be initialized properly';
                    }
                  );
                });
                
                return d.promise; // Return promise
              };
            });
            
            /**
             * Map Facebook sdk XFBML.parse() to NgFacebook.
             */
            NgFacebook.prototype.parseXFBML = function() {
              // Create deferred
              var d = $q.defer();
              
              $timeout(function() {
                // Call when loadDeferred be resolved, meaning Service is ready to be used
                loadDeferred.promise.then(
                  function() {
                    $window.FB.parse();
                    d.resolve();
                  },
                  function() {
                    throw 'Facebook API could not be initialized properly';
                  }
                );
              });
              
              return d.promise; // Return promise
            };
            
            /**
             * Map Facebook sdk subscribe method to NgFacebook. Renamed as subscribe
             * Thus, use it as Facebook.subscribe in the service.
             */
            NgFacebook.prototype.subscribe = function() {
              // Create deferred
              var d = $q.defer();
              
              // Get arguments passed into an array
              var args = Array.prototype.slice.call(arguments);
              
              // Get user function if any is given as last argument
              var userFn;
              if (angular.isFunction(args[args.length-1]))
                userFn = args.pop();
              
              // Append our custom function into arguments array
              args.push(function(response) {
                $timeout(function() {
                  if (angular.isUndefined(response.error)) {
                    // Success
                    d.resolve(response);
                  } else {
                    // Error
                    d.reject(response);
                  }
                  
                  // Call user function and pass response
                  if (angular.isFunction(userFn))
                    userFn(response);
                });
              });
              
              $timeout(function() {
                // Call when loadDeferred be resolved, meaning Service is ready to be used
                loadDeferred.promise.then(
                  function() {
                    $window.FB.Event.subscribe.apply(FB, args);
                  },
                  function() {
                    throw 'Facebook API could not be initialized properly';
                  }
                );
              });
              
              return d.promise; // Return promise
            };
            
            /**
             * Map Facebook sdk unsubscribe method to NgFacebook. Renamed as unsubscribe
             * Thus, use it as Facebook.unsubscribe in the service.
             */
            NgFacebook.prototype.unsubscribe = function() {
              // Create deferred
              var d = $q.defer();
              
              // Get arguments passed into an array
              var args = Array.prototype.slice.call(arguments);
              
              // Get user function if any is given as last argument
              var userFn;
              if (angular.isFunction(args[args.length-1]))
                userFn = args.pop();
              
              // Append our custom function into arguments array
              args.push(function(response) {
                $timeout(function() {
                  if (angular.isUndefined(response.error)) {
                    // Success
                    d.resolve(response);
                  } else {
                    // Error
                    d.reject(response);
                  }
                  
                  // Call user function and pass response
                  if (angular.isFunction(userFn))
                    userFn(response);
                });
              });
              
              $timeout(function() {
                // Call when loadDeferred be resolved, meaning Service is ready to be used
                loadDeferred.promise.then(
                  function() {
                    $window.FB.Event.unsubscribe.apply(FB, args);
                  },
                  function() {
                    throw 'Facebook API could not be initialized properly';
                  }
                );
              });
              
              return d.promise; // Return promise
            };
            
            return new NgFacebook(); // Singleton
          }
        ];
        
      }
    ]).
    
    /**
     * Module initialization
     */
    run([
      '$rootScope',
      '$q',
      '$window',
      '$timeout',
      function($rootScope, $q, $window, $timeout) {
        // Define global loadDeffered to notify when Service callbacks are safe to use
        loadDeferred = $q.defer();
        
        /**
         * Define fbAsyncInit required by Facebook API
         */
        $window.fbAsyncInit = function() {
          // Initialize our Facebook app
          $timeout(function() {
            if (!settings.appId)
              throw 'Missing appId setting.';
              
            FB.init(settings); // Call Facebook init method
            
            flags.ready = true; // Set ready global flag
          });
          
          /**
           * Subscribe to Facebook API events and broadcast through app.
           */
          angular.forEach({
            'auth.login': 'login',
            'auth.logout': 'logout',
            'auth.prompt': 'prompt',
            'auth.sessionChange': 'sessionChange',
            'auth.statusChange': 'statusChange',
            'auth.authResponseChange ': 'authResponseChange',
            'xfbml.render': 'xfbmlRender',
            'edge.create': 'like',
            'edge.remove': 'unlike',
            'comment.create': 'comment',
            'comment.remove': 'uncomment'
          }, function(mapped, name) {
            FB.Event.subscribe(name, function(response) {
              $timeout(function() {
                $rootScope.$broadcast('Facebook:' + mapped, response);
              });
            });
          });
          
          // Broadcast Facebook:load event.
          $rootScope.$broadcast('Facebook:load');
          
          // Resolve loadDeferred
          loadDeferred.resolve(FB);
        
        }; // End of fbAsyncInit
        
        /**
         * Inject Facebook root element in DOM
         */
        (function addFBRoot() {
          var fbroot = document.getElementById('fb-root');

          if (!fbroot) {
            fbroot = document.createElement('div');
            fbroot.id = 'fb-root';
            document.body.insertBefore(fbroot, document.body.childNodes[0]);
          }
          
          return fbroot;
        })();
        
        /**
         * SDK script injecting
         */
        (function injectScript(src) {
          var src           = '//connect.facebook.net/' + settings.locale + '/all.js',
              script        = document.createElement('script');
              script.id     = 'facebook-jssdk';
              script.async  = true;
          
          // Prefix protocol
          if ($window.location.protocol === 'file')
            src = 'https:' + src;
          
          script.src = src;
          script.onload = function() {
            flags.sdk = true; // Set sdk global flag
          };
          document.getElementsByTagName('head')[0].appendChild(script); // // Fix for IE < 9, and yet supported by lattest browsers
          
        })();
        
      }
    ]);
  
})(window, angular);