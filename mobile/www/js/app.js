function isProduction() {
  return window.location.host.indexOf("localhost") < 0 || // prod in browser
    !!window.cordova; // prod in app
}

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
  'ionic',
  'starter.controllers',
  'starter.services',
  // 'ngCordova'
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

    $http.defaults.headers.common['Accept'] = 'application/json';
    $http.defaults.headers.common['Content-Type'] = 'application/json';
  });
})

.config(function ($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: "AppController"
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.newsletters', {
    url: '/newsletters',
    views: {
      'tab-newsletters': {
        templateUrl: 'templates/tab-newsletters.html',
        controller: 'NewsletterListController'
      }
    }
  })

  .state('tab.newsletter', {
    url: '/newsletters/:newsletterId',
    views: {
      'tab-newsletters': {
        templateUrl: 'templates/newsletter-detail.html',
        controller: 'NewsletterDetailController'
      }
    }
  })

  .state('tab.newsletter-beers', {
    url: '/newsletters/:newsletterId/beers',
    views: {
      'tab-newsletters': {
        templateUrl: 'templates/newsletter-beer-list.html',
        controller: 'NewsletterBeerListController'
      }
    }
  })

  .state('tab.newsletter-beer', {
    url: '/newsletters/:newsletterId/beers/:beerId',
    views: {
      'tab-newsletters': {
        templateUrl: 'templates/newsletter-beer-detail.html',
        controller: 'NewsletterBeerDetailController'
      }
    }
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

})

.constant("AppSettings", {
  apiHost: isProduction() ? "http://beer-news.herokuapp.com" : "/api",
  throttleRate: 20 * 1000, // 20 seconds
  gamesRefreshRate: 2 * 60 * 1000, // 2 minutes
  scoreboardsRefreshRate: 5 * 60 * 1000, // 5 minutes
  highlightDuration: 5 * 1000 // 5 seconds (+ 1 for fade out in css)
})
;
