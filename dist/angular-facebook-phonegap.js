/*
---
name: Phonegap Facebook Angularjs

description: Provides a dependency for Phonegap projects.

license: MIT-style license

authors:
  - Ciul

requires: [angular, facebook]
provides: [angular-facebook-phonegap]

...
*/
(function(window, angular, undefined) {
  'use strict';

  angular.module('facebook').

      /**
       * Phonegap run code block
       * This loads the SDK  from a local javascript file on deviceready event,
       * as demanded by Facebook API documentation.
       */
      run([
        'settings',
        'flags',
       function(settings, flags) {

        // Local javascript file that contains the Facebook SDK.
        var localSDKSrc = angular.isDefined(settings.localSDK) ? settings.localSDK : null;
        if (angular.isString(localSDKSrc)) {
          if (localSDKSrc.search('.js') === -1) {
            localSDKSrc = localSDKSrc + '.js';
          }
          // Remove it from settings since it's not an API expected property.
          delete(settings['localSDK']);
        }

        // Phonegap deviceready event fired!, now load Facebook SDK
        function onReady() {
          if (!angular.isString(localSDKSrc)) {
            throw 'Missing localSDK setting pointing to the local javascript file with the Facebook SDK';
          }

          var src           = localSDKSrc,
              script        = document.createElement('script');
              script.id     = 'facebook-jssdk';
              script.async  = true;

          script.src = src;
          script.onload = function() {
            flags.sdk = true; // Set sdk global flag
          };

          document.getElementsByTagName('head')[0].appendChild(script); // // Fix for IE < 9, and yet supported by lattest browsers
        }

        document.addEventListener("deviceready", onReady, false);
       }
      ]);

})(window, angular);