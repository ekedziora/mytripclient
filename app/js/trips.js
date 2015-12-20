angular.module('trips', ['uiGmapgoogle-maps'])

    .config(['uiGmapGoogleMapApiProvider',
        function (uiGmapGoogleMapApiProvider) {

            uiGmapGoogleMapApiProvider.configure({
                //key, hmm
                v: '3.20',
                libraries: 'weather,geometry,visualization'
            });

        }])

    .controller('TripsController', ['$scope', '$filter', 'uiGmapGoogleMapApi', 'TripsService', 'repository',
        function ($scope, $filter, uiGmapGoogleMapApi, tripsService, repository) {

            /*repository.getTrips(
                function(res) {
                    $scope.trips = res;
                },
                function(res) {
                    console.log(res);
                }
            );*/

            //todo to throw
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
            };

            tripsService.getTrips(
                function (res) {
                    //res mocked for now
                    res = mockedTripsResponse;
                    $scope.trips = res;
                    $scope.photo = $filter('filter')(mockedPhotos, {tripId: res[0].Id, defaultBigThumbnail: true}, true);
                },
                function (res) {
                    console.log(res);
                }
            );

            $scope.photos = mockedPhotos;

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
    .service('TripsService', ['$http', function ($http) {
        var baseUrl = "http://mytrip244611.azurewebsites.net/api/";

        return {
            getTrips: function (success, error) {
                $http.get(baseUrl + 'trip').success(success).error(error)
            },
            insertTripRoute: function (data, success, error) {
                $http.post(baseUrl + 'trip/insert', data).success(success).error(error)
            }
        };
    }]);