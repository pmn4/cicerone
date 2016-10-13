angular.module("starter.controllers", [])

.controller("AppController", function ($rootScope, $scope) {
  // $rootScope.apiAuth = {};
  // $rootScope.$watch("apiAuth.accessToken", function (token) {
  //   if (!token) { return; }

  //   AppStateService.authToken(token);
  // });

  // $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
  //   ga("set", {
  //     page: toState.url,
  //     title: toState.name
  //   });

  //   ga("send", "pageview");
  // });

  $rootScope.indicators = {
    // offline: false,
    ajaxing: 0,
    initialized: false
  };

  $rootScope.touchDevice = ('ontouchstart' in document.documentElement);

  $scope.indicateAjaxing = function (isAjaxing) {
    if (isAjaxing) {
      $rootScope.indicators.ajaxing++;
    } else {
      $rootScope.indicators.ajaxing = Math.max(0, $rootScope.indicators.ajaxing - 1);
    }

    return isAjaxing;
  };
})

.controller("NewsletterListController", function ($scope, Newsletter, MessageService) {
  $scope.initialized = false;

  $scope.refresh = function () {
    $scope.ajaxing = $scope.indicateAjaxing(true);

    Newsletter.all()
      .then(function (response) {
        $scope.newsletters = response.data;
      }, function (response) {
        MessageService.responseError(response);
      })
      .finally(function () {
        $scope.initialized = true;
        $scope.ajaxing = $scope.indicateAjaxing(false);

        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });
  };
  $scope.refresh();

  // $scope.$on("$ionicView.enter", function(e) {
  //   $scope.refresh();
  // });
})

.controller("NewsletterDetailController", function ($scope, $stateParams, Newsletter, MessageService) {
  $scope.initialized = false;
  $scope.newsletterId = $stateParams.newsletterId;

  $scope.refresh = function () {
    $scope.ajaxing = $scope.indicateAjaxing(true);

    Newsletter.fund($scope.newsletterId)
      .then(function (response) {
        $scope.newsletter = response.data;
      }, function (response) {
        MessageService.responseError(response);
      })
      .finally(function () {
        $scope.initialized = true;
        $scope.ajaxing = $scope.indicateAjaxing(false);

        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });
  };
  $scope.refresh();

  // $scope.$on("$ionicView.enter", function(e) {
  //   $scope.refresh();
  // });
})

.controller("AccountCtrl", function ($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
