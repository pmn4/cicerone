angular.module("starter.services", [])

.factory("Newsletter", function ($http, AppSettings) {
  return {
    all: function () {
      return $http({
        method: "GET",
        url: AppSettings.apiHost + "/newsletters"
      });
    },

    create: function (resourceObj) {
      return $http({
        method: "POST",
        url: AppSettings.apiHost + "/newsletters",
        data: { newsletter: resourceObj }
      });
    },

    find: function (resourceId) {
      return $http({
        method: "GET",
        url: AppSettings.apiHost + "/newsletters/" + resourceId
      });
    },

    destroy: function (resourceId) {
      return $http({
        method: "DELETE",
        url: AppSettings.apiHost + "/newsletters/" + resourceId
      });
    },

    allBlocks: function (resourceId) {
      return $http({
        method: "GET",
        url: AppSettings.apiHost + "/newsletters/" + resourceId + "/blocks"
      });
    },

    createBeerBlock: function (resourceId, resourceObj) {
      return $http({
        method: "POST",
        url: AppSettings.apiHost + "/newsletters/" + resourceId + "/beer_blocks",
        data: { newsletter_block: resourceObj }
      });
    },

    createContentBlock: function (resourceId, resourceObj) {
      return $http({
        method: "POST",
        url: AppSettings.apiHost + "/newsletters/" + resourceId + "/content_blocks",
        data: { newsletter_block: resourceObj }
      });
    },

    findBlock: function (resourceId, blockId) {
      return $http({
        method: "GET",
        url: AppSettings.apiHost + "/newsletters/" + resourceId + "/blocks/" + blockId
      });
    },

    updateBlock: function (resourceId, resourceObj) {
      return $http({
        method: "PUT",
        url: AppSettings.apiHost + "/newsletters/" + resourceId + "/blocks/" + blockId,
        data: { newsletter_block: resourceObj }
      });
    },

    destroyBlock: function (resourceId, blockId) {
      return $http({
        method: "DELETE",
        url: AppSettings.apiHost + "/newsletters/" + resourceId + "/blocks/" + blockId
      });
    },

    sendPreviewEmail: function (resourceId) {
      return $http({
        method: "POST",
        url: AppSettings.apiHost + "/newsletters/" + resourceId + "/emails",
        data: { email: { preview: true } }
      });
    },

    sendEmail: function (resourceId) {
      return $http({
        method: "POST",
        url: AppSettings.apiHost + "/newsletters/" + resourceId + "/emails",
        data: { email: { preview: false } }
      });
    }
  };
})

.factory("Beer", function ($http, AppSettings) {
  return {
    all: function (params) {
      return $http({
        method: "GET",
        url: AppSettings.apiHost + "/beers",
        params: params
      });
    },

    find: function (id) {
      return $http({
        method: "GET",
        url: AppSettings.apiHost + "/beers/" + id
      });
    },

    findByUpc: function (upc) {
      return $http({
        method: "GET",
        url: AppSettings.apiHost + "/upcs",
        params: {
          code: upc
        }
      });
    }
  };
})

.controller("MessageServiceController", function ($scope) {
  // $scope.$on("$ionicView.enter", function () {
  //  console.log("MessageServiceController.enter");
  // });
})

.service("MessageService", function ($document, $rootScope, $q, $compile, $controller, $animate, $timeout) {
  function MessageService() {}

  // begin private functions
  function typeClassname(type) {
    switch (type) {
      case "error": return "assertive";
      case "warning": return "energized";
      case "success": return "balanced";
      case "info": return "positive";
      case "debug": return "stable";
    }
  }

  function appendChild(parent, child) {
    var children = parent.children();

    if (children.length > 0) {
      return $animate.enter(child, parent, children[children.length - 1]);
    }

    return $animate.enter(child, parent);
  }
  // end private functions

  MessageService.template = '' +
    '<div class="toast-message {{ classname }} show">' +
      '<ul class="content">' +
        '<li ng-repeat="message in messages track by $index">' +
          '{{ message }}' +
        '</li>' +
      '</ul>' +
    '</div>';

  MessageService.prototype._classname = function (type) {
    var classes = [typeClassname(type)];

    if (this.style) {
      classes.push(this.style);
    }

    return classes.join(" ");
  };

  MessageService.prototype.message = function (message, type, options) {
    var _this = this, msg, deferred;

    if (!options) { options = {}; }

    // message can be a string or an array of messages.
    // we always pass an array to the template
    msg = [].concat(message);
    type = type || "info";

    if (_.isEqual(this.msg, msg)) { return $q.reject(); }

    this.msg = msg;
    $timeout(function () { _this.msg = null; }, 1000);

    deferred = $q.resolve(MessageService.template)
      .then(function (template) {
        var inputs, scope, element, controller;

        scope = $rootScope.$new();

        scope.classname = _this._classname(type);
        scope.type = type;
        scope.messages = _this.msg;

        inputs = {
          $scope: scope,
          close: function (result, delay) {
            var animationDuration = 1000; // see _toast-message.scss

            $timeout(function () {
              element.removeClass("show");

              $timeout(function () {
                //  Let angular remove the element and wait for animations to finish.
                $animate.leave(element)
                  .then(function () {
                    //  Resolve the 'closed' promise.
                    // closedDeferred.resolve(result);

                    //  We can now clean up the scope
                    scope.$destroy();

                    //  Unless we null out all of these objects we seem to suffer
                    //  from memory leaks, if anyone can explain why then I'd
                    //  be very interested to know.
                    inputs.close = null;
                    inputs = null;
                    scope = null;
                    element = null;
                    controller = null;
                  });
              }, animationDuration);
            }, delay || 4000);
          }
        };

        element = $compile(template)(scope);
        inputs.$element = element;
        controller = $controller("MessageServiceController", inputs);

        appendChild($document.find("body"), element);

        // deferred.resolve({
        //  close: closeDeferred.promise,
        //  closed: closedDeferred.promise
        // });

        if (!options.keepOpen) {
          inputs.close();
        }

        return inputs.close;
      });

    return deferred;
  };

  _.each(["debug", "info", "success", "warning", "error"], function (method) {
    MessageService.prototype[method] = function (message, options) {
      return this.message(message, method, options);
    };
  });

  MessageService.prototype.responseError = function (response, options) {
    var msg = response.statusText;

    if (_.isString(response.data)) {
      msg = response.data;
    } else if (_.isArray(response.data)) {
      msg = response.data;
    } else if (_.isObject(response.data)) {
      msg = response.data.messages;
    }

    this.error(msg, options);
  };

  return new MessageService();
})
;
