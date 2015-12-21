'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', ['ngRoute', 'ngStorage', 'myApp.version', 'trips'])
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
            })
            .when('/trip/:id', {
                templateUrl: 'trips/trip.html',
                controller: 'TripsController'
            })
            .when('/trip', {
                templateUrl: 'trips/trip.html',
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

    .service('IdentityService', ['$http', '$localStorage', function($http, $localStorage){
        var baseUrl = "http://mytrippwapi.azurewebsites.net/api/";

        return {
            signIn: function(data, success, error) {
                $http.post(baseUrl + 'auth/token', $.param(data), {
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                }).success(success).error(error)
            },
            signUp: function(data, success, error) {
                $http.post(baseUrl + 'Account/Register', data).success(success).error(error)
            },
            logout: function() {
                delete $localStorage.user;
            }
        };
    }])

    .controller('IdentityController', ['$scope', '$localStorage', 'IdentityService', function($scope, $localStorage, IdentityService) {
        if ($localStorage.user) {
            if ($localStorage.user.username) {
                $scope.username = $localStorage.user.username;
            }
        }

        $scope.signOut = function() {
            IdentityService.logout();
        }
    }])

    .controller('SignInController', ['$scope', 'IdentityService', '$localStorage','$location', function($scope, IdentityService, $localStorage, $location) {
        $scope.signIn = function () {
            var formData = {
                grant_type: "password",
                username: $scope.username,
                password: $scope.password
            };

            // czyszczenie tymczasowo bo na serwerze leci wyjątek prawdopodobnie jak interceptor dołączy token do tego requestu
            delete $localStorage.user;

            IdentityService.signIn(formData,
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

    .controller('SignUpController', ['$scope', '$location', 'IdentityService', function($scope, $location, IdentityService) {
        $scope.signUp = function () {
            var formData = {
                username: $scope.username,
                password: $scope.password
            };

            IdentityService.signUp(formData,
                function(res) {
                    $location.url('/signIn')
                },
                function(res) {
                    $scope.message = res['ModelState'][""][0];
                }
            );
        }
    }]);