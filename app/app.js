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
            .when('/resetPassword/provideEmail', {
                templateUrl: 'template/resetPassword/provideEmail.html',
                controller: 'ResetPasswordController'
            })
            .when('/resetPassword/emailSent', {
                templateUrl: 'template/resetPassword/emailSent.html',
                controller: 'ResetPasswordController'
            })
            .when('/resetPassword/newPassword', {
                templateUrl: 'template/resetPassword/insertNewPassword.html',
                controller: 'ResetPasswordController'
            })
            .when('/resetPassword/saved', {
                templateUrl: 'template/resetPassword/newPasswordSaved.html',
                controller: 'ResetPasswordController'
            })
            .when('/trips', {
                templateUrl: 'template/trips/trips.html',
                controller: 'TripsController'
            })
            .when('/trips/:tab', {
                templateUrl: 'template/trips/trips.html',
                controller: 'TripsController'
            })
            .when('/trip/:tab/:id', {
                templateUrl: 'template/trips/trip.html',
                controller: 'TripsController'
            });

        $httpProvider.interceptors.push(['$q', '$location', '$localStorage', 'DataShare', function($q, $location, $localStorage, dataShare) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    if ($localStorage.user && $localStorage.user.token) {
                        config.headers.Authorization = 'Bearer ' + $localStorage.user.token;
                    }
                    return config;
                },
                'responseError': function(response) {
                    if (response.status === 401) {
                        dataShare.sharedData.requestErrorMessage = "You have to be signed in to access requested resource";
                        $location.path('/signIn');
                    }
                    if (response.status === 403) {
                        dataShare.sharedData.requestErrorMessage = "You don't have access to requested resource";
                        $location.path('/signIn');
                    }
                    return $q.reject(response);
                }
            };
        }]);

    }]);