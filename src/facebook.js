define(['angular'], function(angular) {
  'use strict';
  var module;
  try {
    angular.module('Facebook'); // Retrieves the Facebook module since it already exists.
  } catch(e) {
    // settings object available for module settings/services definition.
    var settings = {};
    
    angular.module('Facebook', []) // Retrieves the Facebook module but first settingsure it.
      
      // Facebook provider
      .provider('Facebook', [
        function() {
          var that = this; // For easier handling at inner scopes.
          
          // Facebook appId
          settings.appId = null;
          this.setAppId = function(appId) {
            settings.appId = appId;
          };
          
          // Locale language, english by default
          settings.locale = 'en_US';
          this.setLocale = function(locale) {
            settings.locale = locale;
          };
          
          /* 
           Set if you want to check the authentication status
           at the start up of the app 
          */
          settings.status = true;
          this.setStatus = function(status) {
            settings.status = status;
          };
          
          /* 
           Adding a Channel File improves the performance 
           of the javascript SDK, by addressing issues 
           with cross-domain communication in certain browsers. 
          */
          settings.channelUrl = null;
          this.setChannel = function(channel) {
            settings.channelUrl;
          };
          
          /* 
           Enable cookies to allow the server to access 
           the session 
          */
          settings.cookie = true;
          this.setCookie = function(cookie) {
            settings.cookie = cookie;
          };
          
          /* Parse XFBML */
          settings.xbfml = true;
          this.setXfbml = function(enable) {
            settings.xbfml = enable;
          };
          
          // Create Facebook root element in DOM
          var addFBRoot = function() {
            var fbroot = document.getElementById('fb-root');
            if (!fbroot) {
              fbroot    = document.createElement('div');
              fbroot.id = 'fb-root';
              document.body.insertBefore(fbroot, document.body.childNodes[0]);
            }
            
            return fbroot;
          };
          
          /* *
           * Init Facebook API required stuff
           * This will prepare the app earlier (on settingsuration)
           * to 
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
             */
            var facebookScope = $rootScope.$new();
            
            /**
             * Create a $q instance to implement asynchronous calls
             */
            var deferred  = $q.defer();
            
            var ready = false;
            // Facebook API is ready to use
            facebookScope.$on('Facebook:load', function(ev, FB) {
              ready = true;
              $rootScope.$apply(function() {
                deferred.resolve(FB);
              });
              
            });
            
            /**
             * This is the ngFacebook function to be retrieved on Facebook Service request.
             */
            function ngFacebook() {
              this.appId  = settings.appId;
            };
            
            ngFacebook.prototype.isReady = function() {
              return ready;
            };
            
            // Map some asynchronous Facebook sdk methods to ngFacebook
            angular.forEach([
              'login',
              'logout',
              'api',
              'ui',
              'getLoginStatus'
              ], function(name) {
                ngFacebook.prototype[name] = function() {
                  if (angular.isUndefined(window.FB))
                    deferred.promise.then(function() {
                      FB[name].apply(FB, arguments);
                    });
                  else
                    FB[name].apply(FB, arguments);
                };
              }
            );
            
            /**
             * Map Facebook sdk subscribe method to ngFacebook. Renamed as subscribe
             * Thus, use it as Facebook.subscribe in the service.
             */
            ngFacebook.prototype.subscribe = function() {
              if (angular.isUndefined(window.FB))
                deferred.promise.then(function() {
                  FB.Event.subscribe.apply(FB, arguments);
                });
              else
                FB.Event.subscribe.apply(FB, arguments);
            };
            
            /**
             * Map Facebook sdk unsubscribe method to ngFacebook. Renamed as unsubscribe
             * Thus, use it as Facebook.unsubscribe in the service.
             */
            ngFacebook.prototype.unsubscribe = function() {
              if (angular.isUndefined(window.FB))
                deferred.promise.then(function() {
                  FB.Event.unsubscribe.apply(FB, arguments);
                });
              else
                FB.Event.unsubscribe.apply(FB, arguments);
            };
            
            return new ngFacebook();
            
          }];
        }
      ])
      
      // Initialization of module
      .run([
        '$rootScope',
        '$q',
        '$window',
        function($rootScope, $q, $window) {
          
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
              },  function(mapped, name) {
                FB.Event.subscribe(name, function(response) {
                  $rootScope.$broadcast('Facebook:' + mapped, response);
                });
              }
            );
            
          };
          
          // Inject Facebook sdk script into the document head
          var src     = '//connect.facebook.net/'.concat(settings.locale, '/all.js'),
              script  = document.createElement('script');
          script.id     = 'facebook-jssdk';
          script.async  = true;
          script.src    = src;
          document.head.appendChild(script);
          
        }
      ])
      
      ;
      
  } finally {
    return module;
  }
});