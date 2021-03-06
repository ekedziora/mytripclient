angular.module('identity', [])

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

    .service('ResetPasswordService', ['$http', function($http) {
        var baseUrl = "http://mytrippwapi.azurewebsites.net/api/";

        return {
            startResetPassword: function(data, success, error) {
                $http.get(baseUrl + 'Account/PasswordResetEmail?' + $.param(data)).then(success, error)
            },
            saveNewPassword: function(data, success, error) {
                $http.post(baseUrl + 'Account/PasswordReset', data).then(success, error)
            }
        };
    }])

    .controller('SignInController', ['$scope', 'IdentityService', '$localStorage','$location', 'DataShare', function($scope, IdentityService, $localStorage, $location, dataShare) {
        $scope.signedUpMessage = dataShare.message;
        $scope.error = dataShare.sharedData.requestErrorMessage;

        $scope.signIn = function () {
            dataShare.message = "";

            var formData = {
                grant_type: "password",
                username: $scope.username,
                password: $scope.password
            };

            // czyszczenie tymczasowo bo na serwerze leci wyjątek prawdopodobnie jak interceptor dołączy token do tego requestu
            delete $localStorage.user;

            IdentityService.signIn(formData,
                function(res) {
                    $localStorage.user = {
                        username: $scope.username,
                        token: res.access_token
                    };
                    $location.path('/trips');
                },
                function(res) {
                    $scope.error = res.error_description;
                }
            );
        }
    }])

    .controller('SignUpController', ['$scope', '$location', 'IdentityService', 'DataShare', function($scope, $location, IdentityService, dataShare) {
        $scope.signUp = function () {
            var formData = {
                username: $scope.username,
                email: $scope.email,
                password: $scope.password
            };

            IdentityService.signUp(formData,
                function() {
                    dataShare.message = "You've successfully signed up, now you can sign in.";
                    $location.url('/signIn')
                },
                function(res) {
                    $scope.message = res['ModelState'][""][0];
                }
            );
        }
    }])

    .controller('ResetPasswordController', ['$scope', '$location', '$routeParams', 'ResetPasswordService', 'DataShare', function ($scope, $location, $routeParams, ResetPasswordService, DataShare) {
        $scope.emailSentMessage = DataShare.sharedData.emailSentMessage;

        $scope.sendResetLink = function () {
            var data = {
                email: $scope.email
            };

            ResetPasswordService.startResetPassword(data,
                function() {
                    DataShare.sharedData.emailSentMessage = 'We\'ve just send you an email to ' + data.email + '. Please follow its instructions to reset your password.';
                    $location.url('/resetPassword/emailSent')
                },
                function(res) {
                    $scope.errorMessage = "Password reset was unsuccessful"
                }
            )
        };

        $scope.saveNewPassword = function ($event) {
            var form = $scope.form;
            token = $routeParams.token;
            userId = $routeParams.userid;
            $scope.errorMessages = [];

            if (form.newPassword !== form.newPasswordRepeat) {
                $scope.errorMessages.push("Provided passwords don't match");
            }
            if (!token || !userId) {
                $scope.errorMessages.push("Used reset password link is invalid");
            }

            if($scope.errorMessages && $scope.errorMessages.length > 0) {
                $event.preventDefault();
            } else {
                var data = {
                    UserId: userId,
                    Password: form.newPassword,
                    Token: token
                };

                ResetPasswordService.saveNewPassword(data,
                    function() {
                        $location.url('/resetPassword/saved')
                    },
                    function(res) {
                        if (res.status == 400) {
                            $scope.errorMessages.push("Used reset password link is invalid")
                        } else {
                            $scope.errorMessages.push("New password save was unsuccessful")
                        }
                    }
                )
            }
        }
    }])

    .factory('DataShare', function(){
        return {
            message: '',
            sharedData: {}
        };
    });