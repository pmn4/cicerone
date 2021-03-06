angular.module("starter.controllers", [])

.controller("AppController", function ($rootScope, $scope, $ionicPlatform, $window, $timeout) {
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

  function checkFeatures() {
    $rootScope.features = {
      hasScanner: $window.cordova && cordova.plugins && !!cordova.plugins.barcodeScanner
    };
  }
  checkFeatures();
  $ionicPlatform.ready(checkFeatures);

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

.controller("HomeController", function () {})

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

  $scope.$on("$ionicView.enter", function(e) {
    $scope.refresh();
  });
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

.controller("NewsletterDetailController", function ($scope, $state, $stateParams, $ionicPopup, $ionicModal, $ionicPopover, $cordovaBarcodeScanner, MessageService, Newsletter, Beer) {
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

  $scope.addBlock = function (block_type, beerKey) {
    $state.go("tab.newsletterBlockNew", {
      newsletterId: $scope.newsletterId,
      block_type: block_type,
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

  $scope.showSearchForm = function (isUpcSearch) {
    $searchScope.isUpcSearch = isUpcSearch;
    $searchScope.initialized = !!$searchScope.searchResults;
    $searchScope.modal.show();
  };

  $searchScope.cancel = $scope.hideSearchForm = function () {
    $searchScope.modal.hide();
  };

  $searchScope.searching = 0;
  function search() {
    if (!$searchScope.formData || !$searchScope.formData.search) { return; }

    $scope.ajaxing = $scope.indicateAjaxing(true);

    Beer.all({ name: $searchScope.formData.search })
      .then(function (response) {
        $scope.formData = {};

        $searchScope.searchResults = response.data;
      }, function (response) {
        MessageService.responseError(response);
      })
      .finally(function () {
        $searchScope.initialized = true;
        $scope.ajaxing = $scope.indicateAjaxing(false);
      });
  };

  $searchScope.$watch("formData.search", search);

  $searchScope.chooseBeer = function () {
    $scope.hideSearchForm();

    $scope.addBlock("beer", $searchScope.formData.beerKey);
  };

  /////////// debug code ///////////
  $scope.upc = { code: "" };
  $scope.$watch("upc.code", function (code) {
    if (!code) { return; }

    findByUpc(code);
  });
  //////// (end) debug code ////////

  function findByUpc(upc) {
    Beer.findByUpc(upc)
      .then(function (response) {
        if (response.data && response.data.length === 1) {
          return $scope.addBlock("beer", response.data[0].response.id);
        }

        $searchScope.searchResults = response.data;
        $scope.showSearchForm(true);
      }, function (response) {
        MessageService.responseError(response);
      });
  }

  $scope.scan = function () {
    $cordovaBarcodeScanner
      .scan()
      .then(function (barcodeData) {
        return findByUpc(barcodeData.text);
      }, function (error) {
        MessageService.error(error);
      });
  };

  $scope.search = function () {
    $scope.showSearchForm();
  };

  $scope.text = function () {
    $scope.addBlock("content");
  };

  $scope.$on("$ionicView.enter", function(e) {
    $scope.refresh();
  });


  var $popoverScope = $scope.$new();

  $popoverScope.sendPreviewEmail = function () {
    $scope.hideOptionsMenu();

    $scope.ajaxing = $scope.indicateAjaxing(true);

    Newsletter.sendPreviewEmail($scope.newsletterId)
      .then(function (response) {
        MessageService.success("Email sent to " + response.data.email + "!");
      }, function (response) {
        MessageService.responseError(response);
      })
      .finally(function () {
        $scope.ajaxing = $scope.indicateAjaxing(false);
      });
  };

  function _destroy() {
    $scope.ajaxing = $scope.indicateAjaxing(true);

    Newsletter.destroy($scope.newsletterId)
      .then(function (response) {
        MessageService.success("Deleted.")

        $state.go("tab.newsletters", {}, { location: "replace" });
      }, function (response) {
        MessageService.responseError(response);
      })
      .finally(function () {
        $scope.ajaxing = $scope.indicateAjaxing(false);
      });
  }

  $popoverScope.destroy = function () {
    $scope.hideOptionsMenu();

    $ionicPopup.confirm({
      title: "Delete Newsletter",
      template: "Are you sure you want to delete this newsletter?",
      okText: "Delete",
      okType: "button-assertive"
    }).then(function (res) {
      if (!res) { return; }

      _destroy();
    });
  };

  $ionicPopover.fromTemplateUrl("templates/popovers/newsletter-detail.html", {
    scope: $popoverScope
  }).then(function (popover) {
    $scope.popover = popover;
  });

  $scope.showOptionsMenu = function ($event) {
    $scope.popover.show($event);
  };

  $scope.hideOptionsMenu = function() {
    $scope.popover.hide();
  };
})

.controller("NewsletterBlockNewController", function ($scope, $state, $stateParams, $ionicHistory, MessageService, Newsletter, Beer) {
  $scope.initialized = false;
  $scope.newsletterId = $stateParams.newsletterId;

  $scope.formData = {
    newsletter_id: $scope.newsletterId,
    block_type: $stateParams.block_type,
    beer_key: $stateParams.beerKey
  };

  if (!$scope.formData.content_type) {
    $scope.formData.block_type = $stateParams.beerKey ? "Beer" : "Content";
  }

  $scope.ui = {};
  $scope.$watch("formData.block_type", function (type) {
    $scope.ui.isBeerBlock = type == "Beer";
    $scope.ui.messageLabel = $scope.ui.isBeerBlock ?
      'Say something about this beer' :
      'Add some text...';
  });

  if ($scope.formData.beer_key) {
    Beer.find($scope.formData.beer_key)
      .then(function (response) {
        $scope.beer = response.data;
      });
  }

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
    } else if ($scope.formData.block_type == "Beer") {
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

.controller("NewsletterBlockDetailController", function ($scope, $state, $stateParams, $ionicHistory, $ionicPopup, $ionicPopover, MessageService, Newsletter) {
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

  $scope.$watch("block", function (block) {
    $scope.formData = angular.extend({}, block);
  });

  var backToParent = $scope.cancel = function () {
    if ($ionicHistory.backView()) {
      return $ionicHistory.goBack();
    }

    $state.go("tab.newsletter", {
      newsletterId: $scope.newsletterId
    }, { location: "replace" });
  };

  $scope.save = function (form) {
    $scope.ajaxing = $scope.indicateAjaxing(true);

    Newsletter.updateBlock($scope.newsletterId, $scope.block.id, $scope.formData)
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

  var $popoverScope = $scope.$new();

  function _destroy() {
    $scope.ajaxing = $scope.indicateAjaxing(true);

    Newsletter.destroyBlock($scope.newsletterId, $scope.blockId)
      .then(function (response) {
        MessageService.success("Deleted.")

        $state.go("tab.newsletter", {
          newsletterId: $scope.newsletterId
        }, { location: "replace" });
      }, function (response) {
        MessageService.responseError(response);
      })
      .finally(function () {
        $scope.ajaxing = $scope.indicateAjaxing(false);
      });
  }

  $scope.destroy = function () {
    var title = "Delete";

    if ($scope.block.block_type == 'Beer') {
      title += " Beer";
    } else {
      title += " Content";
    }

    $ionicPopup.confirm({
      title: title,
      template: "Are you sure you want to delete this?",
      okText: "Delete",
      okType: "button-assertive"
    }).then(function (res) {
      if (!res) { return; }

      _destroy();
    });
  };

  $ionicPopover.fromTemplateUrl("templates/popovers/newsletter-block-detail.html", {
    scope: $popoverScope
  }).then(function (popover) {
    $scope.popover = popover;
  });

  $scope.showOptionsMenu = function ($event) {
    $scope.popover.show($event);
  };

  $scope.hideOptionsMenu = function() {
    $scope.popover.hide();
  };
  // $scope.$on("$ionicView.enter", function(e) {
  //   $scope.refresh();
  // });
})

.controller("AccountCtrl", function ($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
