angular.module("starter.directives", [])

.directive("beerHeader", function (Beer) {
  return {
    restrict: "E",

    replace: true,

    scope: {
      beer: "="
    },

    templateUrl: "templates/directives/beer-header.html",

    link: function ($scope) {
      $scope.$watch("beerObject", function (beer) {
        console.log($scope);
      });
    }
  };
})

.directive("beerListItem", function () {
  return {
    restrict: "E",

    replace: true,

    scope: {
      beer: "="
    },

    templateUrl: "templates/directives/beer-list-item.html"
  };
})

.directive("brewlineLogin", function (MessageService, AuthService, AppStateService) {
  return {
    restrict: "E",

    scope: {
      action: "=",
      onAuth: "&"
    },

    templateUrl: "templates/directives/login.html",

    link: function ($scope) {
      $scope.$watch("action", function (action) {
        $scope.label = action == "register" ? "Sign Up" : "Log In";
      });
    }
  };
})

.directive("newsletterBlock", function () {
  return {
    restrict: "E",

    replace: true,

    scope: {
      block: "="
    },

    templateUrl: "templates/directives/newsletter-block.html"
  };
})

.directive("newsletterBlockBeer", function () {
  return {
    restrict: "E",

    replace: true,

    require: ["^newsletterBlock"],

    templateUrl: "templates/directives/newsletter-block__beer.html"
  };
})

.directive("newsletterBlockContent", function () {
  return {
    restrict: "E",

    replace: true,

    require: ["^newsletterBlock"],

    templateUrl: "templates/directives/newsletter-block__content.html"
  };
})

.directive("newsletterBlockForm", function ($ionicModal, Newsletter) {
  return {
    restrict: "E",

    replace: true,

    require: ["^newsletterBlock"],

    scope: {
      newsletterId: "=",
      block: "=",
      formData: "=",
      formElement: "=",
      onSuccess: "&",
      onFailure: "&"
    },

    templateUrl: "templates/directives/newsletter-block-form.html",

    controller: function ($scope) {
      if ($scope.block) {
        $scope.formData = angular.extend($scope.formData, $scope.block);

        if (!$scope.newsletterId) {
          $scope.newsletterId = $scope.block.id;
        }
      }

      // @todo: fetch from API
      $scope.quantityOptions = [{"id":1,"name":"six-pack","quantity":6,"label":"Six Pack","created_at":"2016-10-16T19:14:16.000Z","updated_at":"2016-10-16T19:14:56.000Z"},{"id":2,"name":"growler","quantity":null,"label":"Growler","created_at":"2016-10-16T19:16:03.000Z","updated_at":"2016-10-16T19:16:03.000Z"},{"id":3,"name":"case","quantity":null,"label":"Case","created_at":"2016-10-16T19:16:11.000Z","updated_at":"2016-10-16T19:16:11.000Z"},{"id":4,"name":"keg","quantity":null,"label":"Keg","created_at":"2016-10-16T19:16:19.000Z","updated_at":"2016-10-16T19:16:19.000Z"}];

      $scope.beerScan = function () {
        $scope.formData.inputType = "scan";
        $scope.formData.contentType = "beer";
      };

      $scope.beerSearch = function () {
        $scope.formData.inputType = "search";
        $scope.formData.contentType = "beer";

        // open search modal
      };

      $scope.createContent = function () {
        $scope.formData.inputType = "content";
        $scope.formData.contentType = "content";
      };
    }
  };
})
;