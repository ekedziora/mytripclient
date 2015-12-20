angular.module('trips', ['uiGmapgoogle-maps'])

    .config(['uiGmapGoogleMapApiProvider',
        function (uiGmapGoogleMapApiProvider) {

            uiGmapGoogleMapApiProvider.configure({
                //key, hmm
                v: '3.20',
                libraries: 'weather,geometry,visualization'
            });

        }])

    .controller('TripsController', ['$scope', 'uiGmapGoogleMapApi', 'tripsService',
        function ($scope, uiGmapGoogleMapApi, tripsService) {
            $scope.getTrips = function () {
                tripsService.getTrips(
                    function (res) {
                        //res mocked for now
                        res = mockedTripsResponse;

                        $scope.trips = res;
                    },
                    function (res) {
                        console.log(res);
                    }
                )
            }

            $scope.listPictures = function () {
                if ($scope.pictures)
                    $scope.pictures = null;
                else
                    $scope.pictures = mockedPictures;
            };

            $scope.listWaypoints = function () {
                if ($scope.waypoints)
                    $scope.waypoints = null;
                else
                    $scope.waypoints = mockedWaypoints;
            }

            $scope.markers = [{"id": 1, "latitude": 46, "longitude": -79, "showWindow": false, "show": false}]
            uiGmapGoogleMapApi.then(function (maps) {
                $scope.map =
                {
                    center: {
                        latitude: 52,
                        longitude: 20
                    },
                    zoom: 6
                };
            });
        }])
    .service('tripsService', ['$http', function ($http) {
        var baseUrl = "http://mytrip244611.azurewebsites.net/api/";

        return {
            getTrips: function (success, error) {
                $http.get(baseUrl + 'trip', {
                    headers: //poki nie ma interceptora
                    {"Authorization": "Bearer Z7tKsrol0EUyfwiCob1x05lmF9p8p9rVG5johOaNrXQYU4BjXain1g5v_QZ-beR2Z50FUuFBVCFpZIRybGEEkkz-3uGe1-aoanrx6Q59oz0RClrwU5dMxuU3NaJaD0fpBrEMbDTMHd8L4X4SgoxexkvwM9TItQVYGpVSTGIgvWAMb53cf1PGhU1kI4vq4ekQIoGNyToNHTWdSJJu7jv0rIjO_YCImp6q82JBVbj0lXu9jPSmBl8zwmrUD-zGmRlFSfIfjD1jPozLLQdJrkfmPbXwC5M5jzaXh3uGjXFdmKHF_S3Tikj5F4jio-Yu7mJX"}
                }).success(success).error(error)
            },
            insertTripRoute: function (data, success, error) {
                $http.post(baseUrl + 'account/register', data).success(success).error(error)
            }
        };
    }]);