function isProduction() {
  return window.location.host.indexOf("localhost") < 0 || // prod in browser
    !!window.cordova; // prod in app
}

// angular.module is a global place for creating, registering and retrieving Angular modules
// "starter" is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of "requires"
// "starter.services" is found in services.js
// "starter.controllers" is found in controllers.js
angular.module("starter", [
  "ionic",
  "starter.controllers",
  "starter.directives",
  "starter.filters",
  "starter.services",
  "ngCordova"
])

.run(function ($ionicPlatform, $http) {
  $ionicPlatform.ready(function () {
    // Ionic.io();

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    $http.defaults.headers.common["Accept"] = "application/json";
    $http.defaults.headers.common["Content-Type"] = "application/json";
  });
})

.config(function ($httpProvider, $stateProvider, $urlRouterProvider, $provide) {
  $httpProvider.interceptors.push("authHeaderTokenInterceptor");

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state"s controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state("tab", {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html",
    controller: "AppController"
  })

  // Each tab has its own nav history stack:

  .state("tab.home", {
    url: "/home",
    views: {
      "tab-home": {
        templateUrl: "templates/tab-home.html",
        controller: "HomeController"
      }
    }
  })

  .state("tab.newsletters", {
    url: "/newsletters",
    views: {
      "tab-newsletters": {
        templateUrl: "templates/tab-newsletters.html",
        controller: "NewsletterListController"
      }
    }
  })

  .state("tab.newsletterNew", {
    url: "/newsletters/new",
    views: {
      "tab-newsletters": {
        templateUrl: "templates/newsletter-edit.html",
        controller: "NewsletterNewController"
      }
    }
  })

  .state("tab.newsletter", {
    url: "/newsletters/:newsletterId",
    views: {
      "tab-newsletters": {
        templateUrl: "templates/newsletter-detail.html",
        controller: "NewsletterDetailController"
      }
    }
  })

  .state("tab.newsletterBlocks", {
    url: "/newsletters/:newsletterId/blocks",
    views: {
      "tab-newsletters": {
        templateUrl: "templates/block-list.html",
        controller: "NewsletterBlockListController"
      }
    }
  })

  .state("tab.newsletterBlockNew", {
    url: "/newsletters/:newsletterId/block/new?:contentType&:beerKey",
    views: {
      "tab-newsletters": {
        templateUrl: "templates/block-edit.html",
        controller: "NewsletterBlockNewController"
      }
    }
  })

  .state("tab.newsletterBlock", {
    url: "/newsletters/:newsletterId/block/:blockId",
    views: {
      "tab-newsletters": {
        templateUrl: "templates/block-detail.html",
        controller: "NewsletterBlockDetailController"
      }
    }
  })

  .state("tab.account", {
    url: "/account",
    views: {
      "tab-account": {
        templateUrl: "templates/tab-account.html",
        controller: "AccountCtrl"
      }
    }
  })

  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise("/tab/home");

  // Exception reporting
  $provide.decorator("$exceptionHandler", function ($delegate, exceptionReporter) {
    // Return the new $exceptionHandler implementation which will
    // report the error to our internal error handler before passing
    // it off to the original $exceptionHandler implementation (which
    // may, itself, be some other delegate provided by another part
    // of the application).
    return function exceptionHandlerProxy(error, cause) {
      exceptionReporter.report(error);

      $delegate(error, cause);
    };
  });
})

.factory("exceptionReporter", function ($window, $log) {
  return {
    report: report
  };

  function report(error) {
    if ($window.NREUM && $window.NREUM.noticeError) {
      // try/catch to prevent infinite loop
      try {
        $window.NREUM.noticeError(error);
      } catch (newRelicError) {
        $log.error(newRelicError);
      }
    } else {
      $log.info("New Relic not available.");
    }
  }
})

.config(function ($ionicConfigProvider) {
  $ionicConfigProvider.tabs.position("bottom"); // android default is "top"
})

.factory("authHeaderTokenInterceptor", function ($q, AppSettings, AppStateService, AuthService) {
  return {
    request: function (config) {
      var token = AppStateService.authToken();

      if (!token) { return config; }
      if (!config.url || config.url.indexOf(AppSettings.apiHost) !== 0) {
        return config;
      }

      // config.headers = config.headers || {};
      config.params = config.params || {};
      // add token to request headers

      if (token) {
        // config.headers.authorization = token;
        config.params.access_token = token;
      }

      return config;
    },

    // response: function (response) {
    //  var token;

    //  if (!response && !response.headers) { return response; }
    //  if (!response.config.url || response.config.url.indexOf(AppSettings.apiHost) !== 0) {
    //    return response;
    //  }

    //  token = response.headers("access_token");

    //  if (token) {
    //    AppStateService.authToken(token);
    //  }

    //  return response;
    // }

    responseError: function (response) {
      var action = AppStateService.authToken() ? "login" : "register";

      if (response.status === 401) {
        AuthService.promptForAuthentication(action);
      }

      return $q.reject(response);
    }
  };
})

.constant("_", window._)

.constant("moment", window.moment)

.constant("AppSettings", isProduction() ? {
  apiHost: "http://api.brewline.io",
  oauthHost: "http://api.brewline.io",
  oauthClientId: "50db4a5774deb0168abae583d6a27c1b43d6c64808735df28a4931d5a2b7ccbe",
  oauthRedirectUri: "http://localhost/callback",
  oauthScopes: ""
} : {
  apiHost: "/api",
  oauthHost: "http://localhost:8336",
  oauthClientId: "50db4a5774deb0168abae583d6a27c1b43d6c64808735df28a4931d5a2b7ccbe",
  oauthRedirectUri: "urn:ietf:wg:oauth:2.0:oob",
  oauthScopes: ""
})

;
