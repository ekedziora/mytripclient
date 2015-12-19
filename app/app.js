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

  return {
    signin: function(data, success, error) {
      $http.post(baseUrl + 'auth/token', $.param(data), {
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
      }).success(success).error(error)
    },
    register: function(data, success, error) {
      $http.post(baseUrl + 'account/register', data).success(success).error(error)
    },
    logout: function(success) {
      delete $localStorage.token;
      success();
    }
  };
}])

.controller('SignInController', ['$scope', 'repository', '$localStorage','$location', function($scope, repository, $localStorage, $location) {
  $scope.signIn = function () {
    var formData = {
      grant_type: "password",
      username: $scope.username,
      password: $scope.password
    };

    // czyszczenie tymczasowo bo na serwerze leci wyjątek prawdopodobnie jak interceptor dołączy token do tego requestu
    delete $localStorage.token;

    repository.signin(formData,
      function(res) {
        $localStorage.token = res.access_token;
        $location.path('/trips');
      },
      function(res) {
        $scope.error = res.error_description;
      }
    );
  }
}])

.controller('TripsController', ['$scope', function($scope) {

}]);