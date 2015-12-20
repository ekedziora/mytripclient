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
      .when('/signUp', {
        templateUrl: 'signUp/signUp.html',
        controller: 'SignUpController'
      })
      .when('/trips', {
        templateUrl: 'trips/trips.html',
        controller: 'TripsController'
      });

  $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
    return {
      'request': function (config) {
        config.headers = config.headers || {};
        if ($localStorage.user && $localStorage.user.token) {
          config.headers.Authorization = 'Bearer ' + $localStorage.user.token;
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
    signIn: function(data, success, error) {
      $http.post(baseUrl + 'auth/token', $.param(data), {
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
      }).success(success).error(error)
    },
    signUp: function(data, success, error) {
      $http.post(baseUrl + 'Account/Register', data).success(success).error(error)
    },
    getTrips: function(success, error) {
      $http.get(baseUrl + "Trip").success(success).error(error)
    },
    logout: function(success) {
      delete $localStorage.user;
      success();
    }
  };
}])

.controller('IdentityController', ['$scope', '$localStorage', function($scope, $localStorage) {
  if ($localStorage.user) {
    if ($localStorage.user.username) {
      $scope.username = $localStorage.user.username;
    }
  }
}])

.controller('SignInController', ['$scope', 'repository', '$localStorage','$location', function($scope, repository, $localStorage, $location) {
  $scope.signIn = function () {
    var formData = {
      grant_type: "password",
      username: $scope.username,
      password: $scope.password
    };

    // czyszczenie tymczasowo bo na serwerze leci wyjątek prawdopodobnie jak interceptor dołączy token do tego requestu
    delete $localStorage.user;

    repository.signIn(formData,
      function(res) {
        var user = {
          username: $scope.username,
          token: res.access_token
        };
        $localStorage.user = user;
        $location.path('/trips');
      },
      function(res) {
        $scope.error = res.error_description;
      }
    );
  }
}])

.controller('SignUpController', ['$scope', '$location', 'repository', function($scope, $location, repository) {
  $scope.signUp = function () {
    var formData = {
      username: $scope.username,
      password: $scope.password
    };

    repository.signUp(formData,
        function(res) {
          $location.url('/signIn')
        },
        function(res) {
          $scope.message = res['ModelState'][""][0];
        }
    );
  }
}])

.controller('TripsController', ['$scope', 'repository', function($scope, repository) {

  var s = {};

  repository.getTrips(
      function(res) {
        $scope.trips = res;
      },
      function(res) {
        console.log(res);
      }
  );
}]);