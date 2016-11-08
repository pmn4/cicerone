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

.service("AuthService", function ($injector, $rootScope, $q, $cordovaInAppBrowser, AppSettings, $timeout) {
  function AuthService() {
    this._modal = null;
  }

  function isPublicRoute() {
    var data = $injector.get("$state").$current.data;

    return data && data.access && data.access.isPublic;
  }

  function uuid4() {
    //// return uuid of form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    var uuid = '', ii;

    for (ii = 0; ii < 32; ii += 1) {
      switch (ii) {
      case 8:
      case 20:
        uuid += '-';
        uuid += (Math.random() * 16 | 0).toString(16);
      break;
      case 12:
        uuid += '-';
        uuid += '4';
      break;
      case 16:
        uuid += '-';
        uuid += (Math.random() * 4 | 8).toString(16);
      break;
      default:
        uuid += (Math.random() * 16 | 0).toString(16);
      }
    }
    return uuid;
  }

  AuthService.prototype.authenticate = function (action) {
    var deferred = $q.defer();
    var responseType = "token";
    var url = AppSettings.oauthHost + "/oauth/authorize" +
      "?client_id=" + AppSettings.oauthClientId +
      "&redirect_uri=" + AppSettings.oauthRedirectUri +
      "&scope=" + AppSettings.oauthScopes +
      "&response_type=" + responseType + // @todo: deprecation warning!  some day this will go JWT
      "&state=" + uuid4() +
      "&view=" + action;

    deferred.notify('opening oauth prompt');

    var opener;
    if (window.cordova && window.cordova.InAppBrowser) {
      opener = window.cordova.InAppBrowser;
    } else {
      opener = window;
    }
    var browserRef = opener.open(url, '_blank', 'location=no');
    var fnCancelled = function (event) {
      deferred.reject("The sign in flow was canceled");
    };

    browserRef.addEventListener("loadstart", function (event) {
      if ((event.url).indexOf(AppSettings.oauthRedirectUri) !== 0) { return; }

      browserRef.removeEventListener("exit", fnCancelled);
      browserRef.close();

      var delimiter = responseType === "token" ? "#" : "?";
      var callbackResponse = (event.url).split(delimiter)[1];
      var responseParameters = (callbackResponse).split("&");
      var parameterMap = {};

      for (var i = 0; i < responseParameters.length; i++) {
        var pair = responseParameters[i].split("=");
        parameterMap[pair[0]] = pair[1];
      }

      if (parameterMap.access_token) {
        deferred.resolve({
          accessToken: parameterMap.access_token,
          tokenType: parameterMap.token_type,
          expiresIn: parameterMap.expires_in,
          idToken: parameterMap.id_token
        });
      } else {
        deferred.reject("Problem authenticating");
      }
    });

    browserRef.addEventListener("exit", fnCancelled);

    return deferred.promise;
  };

  AuthService.prototype.promptForAuthentication = function (action) {
    var _this = this, scope, title, subTitle;

    if (this._modal) { return; }
    if (isPublicRoute()) { return; }

    if (!action) { action = "login"; }
    if (action === "register") {
      subTitle = "Please create an account (or log in) to access this page";
      title = "Please Register";
    } else { // default is "login" behavior
      subTitle = "For extra security, we ask that you log in every 60 minutes";
      title = "Please Login";
    }

    scope = $rootScope.$new();
    scope.openLogin = this.authenticate;
    scope.action = action;

    // @todo: figure out `scope` in ionicPopup
    this._modal = $injector.get("$ionicPopup").show({
      template: '<sportid-login hide-logo="true" action="action" on-auth="openLogin(action)"></sportid-login>',
      title: title,
      subTitle: subTitle,
      scope: scope
    })
    .finally(function () {
      _this._modal = null;
    })
    ;
  };

  return new AuthService();
})

;
