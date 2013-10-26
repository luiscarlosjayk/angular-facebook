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
  
  // settings object available for module settings/services definition.
  var settings = {};
  
  /**
   * Facebook module
   */
  angular.module('facebook', []).

    /**
     * Facebook provider
     */
    provider('Facebook', [function() {

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
       * Create Facebook root element in DOM
       */
      var addFBRoot = function() {
        var fbroot = document.getElementById('fb-root');

        if (!fbroot) {
          fbroot = document.createElement('div');
          fbroot.id = 'fb-root';
          document.body.insertBefore(fbroot, document.body.childNodes[0]);
        }
        
        return fbroot;
      };
      
      /**
       * Init Facebook API required stuff
       * This will prepare the app earlier (on settingsuration)
       */
      this.init = function(customAppId) {
        settings.appId = customAppId || settings.appId; // Pass appId on init is also possible.
        
        // Add Facebook root element
        addFBRoot();
      };
      
      /**
       * This defines the Facebook Service on run.
       */
      this.$get = ['$q', '$rootScope', function($q, $rootScope) {

        /** 
         * Create a new scope for listening to broadcasted events,
         * this is for better approach of asynchronous Facebook API usage.
         * @type {Object}
         */
        var facebookScope = $rootScope.$new(),

        /**
         * Create a deferred instance to implement asynchronous calls
         * @type {Object}
         */
        deferred  = $q.defer(),

        /**
         * Ready state
         * @type {Boolean}
         */
        ready = false;

        /**
         * Facebook API is ready to use
         * @param  {Object} ev
         * @param  {Object} FB
         */
        facebookScope.$on('Facebook:load', function(ev, FB) {
          ready = true;
          $rootScope.$apply(function() {
            deferred.resolve(FB);
          });
        });
        
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
          return ready;
        };
        
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
            if (angular.isUndefined(window.FB)) {
              deferred.promise.then(function() {
                FB[name].apply(FB, arguments);
              });
            } else {
              FB[name].apply(FB, arguments);
            }
          };
        });
        
        /**
         * Map Facebook sdk XFBML.parse() to NgFacebook.
         */
        NgFacebook.prototype.parseXFBML = function() {
          if (angular.isUndefined(window.FB)) {
            deferred.promise.then(function() {
              FB.XFBML.parse();
            });
          } else {
            FB.XFBML.parse();
          }
        };
        
        /**
         * Map Facebook sdk subscribe method to NgFacebook. Renamed as subscribe
         * Thus, use it as Facebook.subscribe in the service.
         */
        NgFacebook.prototype.subscribe = function() {
          if (angular.isUndefined(window.FB)) {
            deferred.promise.then(function() {
              FB.Event.subscribe.apply(FB, arguments);
            });
          } else {
            FB.Event.subscribe.apply(FB, arguments);
          }
        };
        
        /**
         * Map Facebook sdk unsubscribe method to NgFacebook. Renamed as unsubscribe
         * Thus, use it as Facebook.unsubscribe in the service.
         */
        NgFacebook.prototype.unsubscribe = function() {
          if (angular.isUndefined(window.FB)) {
            deferred.promise.then(function() {
              FB.Event.unsubscribe.apply(FB, arguments);
            });
          } else {
            FB.Event.unsubscribe.apply(FB, arguments);
          }
        };
        
        return new NgFacebook();
      }];
  }]).

  // Initialization of module
  run(['$rootScope', '$q','$window', function($rootScope, $q, $window) {

    // Define fbAsyncInit
    $window.fbAsyncInit = function() {
      // Initialize our Facebook app
      $rootScope.$apply(function() {
        FB.init(settings);
      });
      
      // Broadcast Facebook:load event.
      $rootScope.$broadcast('Facebook:load', FB);
      
      /**
       * Subscribe to Facebook API events and broadcast through app.
       */
      angular.forEach({
        'auth.login': 'login',
        'auth.logout': 'logout',
        'auth.prompt': 'prompt',
        'auth.sessionChange': 'sessionChange',
        'auth.statusChange': 'statusChange',
        'xfbml.render': 'xfbmlRender',
        'edge.create': 'like',
        'edge.remove': 'unlike',
        'comment.create': 'comment',
        'comment.remove': 'uncomment'
      }, function(mapped, name) {
        FB.Event.subscribe(name, function(response) {
          $rootScope.$broadcast('Facebook:' + mapped, response);
        });
      });
    };

    // Inject Facebook sdk script into the document head
    var src = '//connect.facebook.net/'.concat(settings.locale, '/all.js'),
    script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.async = true;
    script.src = src;
    document.getElementsByTagName('head')[0].appendChild(script); // Fix for IE < 9, and yet supported by lattest browsers
  }]);

})(window, angular);
