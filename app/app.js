'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', ['ngRoute', 'ngStorage', 'myApp.version', 'trips', 'identity'])
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

    }]);