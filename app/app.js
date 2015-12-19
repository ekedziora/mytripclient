'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', ['ngRoute', 'ngStorage', 'myApp.version'])
.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
  $routeProvider
      .otherwise({redirectTo: '/trips'})
      .when('/signIn', {
        templateUrl: 'signIn/signIn.html',
        controller: 'SignInController'
      })
      .when('/trips', {
        templateUrl: 'trips/trips.html',
        controller: 'TripsController'
      });

  $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
    return {
      'request': function (config) {
        config.headers = config.headers || {};
        if ($localStorage.token) {
          config.headers.Authorization = 'Bearer ' + $localStorage.token;
        }
        return config;
      },
      'responseError': function(response) {
        if(response.status === 401 || response.status === 403) {
          $location.path('/signIn');
        }
        return $q.reject(response);
      }
    };
  }]);
}])

.factory('repository', ['$http', '$localStorage', function($http, $localStorage){
  var baseUrl = "http://mytrip244611.azurewebsites.net/api/";
  function changeUser(user) {
    angular.extend(currentUser, user);
  }

  function urlBase64Decode(str) {
    var output = str.replace('-', '+').replace('_', '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw 'Illegal base64url string!';
    }
    return window.atob(output);
  }

  function getUserFromToken() {
    var token = $localStorage.token;
    var user = {};
    if (typeof token !== 'undefined') {
      var encoded = token.split('.')[1];
      user = JSON.parse(urlBase64Decode(encoded));
    }
    return user;
  }

  var currentUser = getUserFromToken();

  return {
    signIn: function(data, success, error) {
      $http.post(baseUrl + 'auth/token', data).success(success).error(error)
    },
    logout: function(success) {
      changeUser({});
      delete $localStorage.token;
      success();
    }
  };
}])

.controller('SignInController', ['$scope', 'repository', function($scope, repository) {
  $scope.signIn = function () {
    var formData = {
      grant_type: "password",
      username: $scope.username,
      password: $scope.password
    };

    repository.signIn(formData,
      function(res) {
        console.log(res.data);
      },
      function(res) {
        console.log(res.data);
      }
    );
  }
}])

.controller('TripsController', ['$scope', function($scope) {

}]);