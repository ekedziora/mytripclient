'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', ['ngRoute', 'ngStorage', 'myApp.version', 'trips', 'identity', 'media'])
    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {

        $routeProvider
            .otherwise({redirectTo: '/trips'})
            .when('/signIn', {
                templateUrl: 'template/identity/signIn.html',
                controller: 'SignInController'
            })
            .when('/signUp', {
                templateUrl: 'template/identity/signUp.html',
                controller: 'SignUpController'
            })
            .when('/trips', {
                templateUrl: 'template/trips/trips.html',
                controller: 'TripsController'
            })
            .when('/trip/:id', {
                templateUrl: 'template/trips/trip.html',
                controller: 'TripsController'
            })
            .when('/trip', {
                templateUrl: 'template/trips/trip.html',
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

    }]);