angular.module('trips', ['uiGmapgoogle-maps'])

    .config(['uiGmapGoogleMapApiProvider',
        function (uiGmapGoogleMapApiProvider) {

            uiGmapGoogleMapApiProvider.configure({
                //key, hmm
                v: '3.20',
                libraries: 'weather,geometry,visualization'
            });

        }])

    .controller('TripsController', ['$scope', '$filter', 'uiGmapGoogleMapApi', 'TripsService', '$routeParams',
        function ($scope, $filter, uiGmapGoogleMapApi, tripsService, $routeParams) {

            $scope.focusedTrip = $routeParams.id;

            tripsService.getTrips(
                function (res) {
                    //res mocked for now
                    res = mockedTripsResponse;
                    $scope.preview=res.slice(0, 3);
                    $scope.trips = res;
                    $scope.photo = $filter('filter')(mockedPhotos, {
                        tripId: res[0].Id,
                        defaultBigThumbnail: true
                    }, true);
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
                    $scope.waypoints = $scope.map.markers;
            };

            $scope.trackings = [{
                id: 1,
                geotracks: []
            }];

            uiGmapGoogleMapApi.then(function (maps) {
                $scope.map =
                {
                    center: {
                        latitude: 52,
                        longitude: 20
                    },
                    zoom: 6,
                    markers: [],
                    events: {
                        click: function (map, eventName, originalEventArgs) {
                            var e = originalEventArgs[0];
                            var lat = e.latLng.lat(), lon = e.latLng.lng();
                            var marker = {
                                id: Date.now(),
                                coords: {
                                    latitude: lat,
                                    longitude: lon
                                }
                            };
                            $scope.map.markers.push(marker);
                            if($scope.map.markers.length > 0) {
                                $scope.trackings[0].geotracks.push({latitude: marker.coords.latitude, longitude: marker.coords.longitude});
                            }
                            $scope.$apply();
                            console.log($scope.trackings);
                        }
                    }
                };
            });
        }])
    .controller('EditTripController', ['$scope', '$filter', 'TripsService', '$routeParams',
        function ($scope, $filter, tripsService, $routeParams) {

            $scope.requested=true;
            
            $scope.editTrip = function(id) {
                if(id == null) {
                    $scope.newTrip = true;
                }
            };

        }])
    .service('TripsService', ['$http', function ($http) {
        //var baseUrl = "http://mytrip244611.azurewebsites.net/api/";
        var baseUrl = "http://mytrippwapi.azurewebsites.net/api/";

        return {
            getTrips: function (success, error) {
                $http.get(baseUrl + 'trip').success(success).error(error)
            },
            insertTripRoute: function (data, success, error) {
                $http.post(baseUrl + 'trip/insert', data).success(success).error(error)
            }
        };
    }]);