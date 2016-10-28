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

.controller("NewsletterListController", function ($scope, MessageService, Newsletter) {
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

.controller("NewsletterNewController", function ($scope, $state, $stateParams, $ionicHistory, MessageService, Newsletter) {
  $scope.initialized = false;
  $scope.newsletterId = $stateParams.newsletterId;

  $scope.formData = {};

  $scope.cancel = function () {
    if ($ionicHistory.backView()) {
      return $ionicHistory.goBack();
    }

    $state.go("tab.newsletters", null, { location: "replace" });
  };

  $scope.save = function (form) {
    $scope.ajaxing = $scope.indicateAjaxing(true);

    Newsletter.create($scope.formData)
      .then(function (response) {
        MessageService.success("Success!");

        $state.go("tab.newsletter", {
          newsletterId: response.data.id
        }, { location: "replace" });
      }, function (response) {
        MessageService.responseError(response);
      })
      .finally(function () {
        $scope.initialized = true;
        $scope.ajaxing = $scope.indicateAjaxing(false);
      });
  };
})

.controller("NewsletterDetailController", function ($scope, $state, $stateParams, $ionicModal, MessageService, Newsletter, Beer) {
  $scope.initialized = false;
  $scope.newsletterId = $stateParams.newsletterId;

  $scope.refresh = function () {
    $scope.ajaxing = $scope.indicateAjaxing(true);

    Newsletter.find($scope.newsletterId)
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

  $scope.addBlock = function (contentType, beerKey) {
    $state.go("tab.newsletterBlockNew", {
      newsletterId: $scope.newsletterId,
      contentType: contentType,
      beerKey: beerKey
    });
  };

  var $searchScope = $scope.$new();
  $searchScope.formData = {};

  $ionicModal.fromTemplateUrl("templates/modals/beer-search.html", {
    scope: $searchScope,
    animation: "slide-in-up"
  }).then(function (modal) {
    $searchScope.modal = modal;
  });

  $scope.showSearchForm = function () {
    $searchScope.modal.show();
  };

  $searchScope.cancel = $scope.hideSearchForm = function () {
    $searchScope.modal.hide();
  };

  $searchScope.initialized = false;
  $searchScope.searching = 0;
  function search() {
    if (!$searchScope.formData || !$searchScope.formData.search) { return; }

    $scope.searching++;
    Beer.all({ name: $searchScope.formData.search })
      .then(function (response) {
        $scope.formData = {};

        $searchScope.searchResults = response.data;
      }, function (response) {
        MessageService.responseError(response);
      })
      .finally(function () {
        $searchScope.initialized = true;
        $searchScope.searching = Math.max(0, $searchScope.searching - 1);
      });
  };

  $searchScope.$watch("formData.search", search);

  $searchScope.chooseBeer = function () {
    $scope.hideSearchForm();

    $scope.addBlock("beer", $searchScope.formData.beerKey);
  }

  $scope.scan = function () {
    $scope.addBlock("beer", "Sg96qS") // @todo: debugging
  };

  $scope.search = function () {
    $scope.showSearchForm();
  };

  $scope.text = function () {
    $scope.addBlock("content");
  };

  // $scope.$on("$ionicView.enter", function(e) {
  //   $scope.refresh();
  // });
})

.controller("NewsletterBlockNewController", function ($scope, $state, $stateParams, $ionicHistory, MessageService, Newsletter, Beer) {
  $scope.initialized = false;
  $scope.newsletterId = $stateParams.newsletterId;

  $scope.formData = {
    newsletter_id: $scope.newsletterId,
    contentType: $stateParams.contentType,
    beer_key: $stateParams.beerKey
  };

  var backToParent = $scope.cancel = function () {
    if ($ionicHistory.backView()) {
      return $ionicHistory.goBack();
    }

    $state.go("tab.newsletter", {
      newsletterId: $scope.newsletterId
    }, { location: "replace" });
  };

  $scope.save = function (form) {
    var fn;

    $scope.ajaxing = $scope.indicateAjaxing(true);

    if ($scope.block && $scope.block.id) {
      fn = function (newsletterId, formData) {
        return Newsletter.updateBlock(newsletterId, $scope.blockId, formData);
      };
    } else if ($scope.formData.contentType == "beer") {
      fn = Newsletter.createBeerBlock;
    } else {
      fn = Newsletter.createContentBlock;
    }

    fn.call(Newsletter, $scope.newsletterId, $scope.formData)
      .then(function (response) {
        MessageService.success("Success!");

        backToParent();
      }, function (response) {
        MessageService.responseError(response);
      })
      .finally(function () {
        $scope.initialized = true;
        $scope.ajaxing = $scope.indicateAjaxing(false);
      });
  };
})

.controller("NewsletterBlockDetailController", function ($scope, $state, $stateParams, MessageService, Newsletter) {
  $scope.initialized = false;
  $scope.newsletterId = $stateParams.newsletterId;
  $scope.blockId = $stateParams.blockId;

  $scope.refresh = function () {
    $scope.ajaxing = $scope.indicateAjaxing(true);

    Newsletter.findBlock($scope.newsletterId, $stateParams.blockId)
      .then(function (response) {
        $scope.block = response.data;
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
