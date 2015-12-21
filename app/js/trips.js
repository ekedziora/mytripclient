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

            $scope.focusedTrip ? tripsService.getTrip($scope.focusedTrip,
                function (res) {
                    $scope.trip = res;
                },
                function (res) {
                    $scope.trip = res;
                    console.log(res);
                }
            )
                :
                tripsService.getTrips(
                    function (res) {
                        //res mocked for now
                        console.log(res);
                        res = mockedTripsResponse;
                        $scope.preview = res.slice(0, 3);
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

            var markers = [];
            //mapping trips from response to map markers
            angular.forEach(mockedTripResponse.route.points, function (val) {
                this.push({
                    id: Date.now(),//todo
                    coords: {
                        latitude: val.latitude,
                        longitude: val.longitude,
                        city: val.city
                    }
                });
                //setting trackings
                $scope.trackings[0].geotracks.push(
                    {
                        latitude: val.latitude,
                        longitude: val.longitude
                    }
                )

            }, markers);

            uiGmapGoogleMapApi.then(function (maps) {
                $scope.map =
                {
                    center: {
                        latitude: 52,
                        longitude: 20
                    },
                    zoom: 6,
                    markers: markers
                    /*events: {
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
                     $scope.trackings[0].geotracks.push(
                     {
                     latitude: marker.coords.latitude,
                     longitude: marker.coords.longitude
                     }
                     );
                     }
                     $scope.$apply();
                     console.log($scope.trackings);
                     }
                     }*/
                };
            });
        }])
    .controller('EditTripController', ['$scope', '$filter', 'TripsService',
        function ($scope, $filter, tripsService) {

            $scope.setFile = function(file) {
                $scope.tripFile=file.files[0];
            };

            $scope.openEdit = function (id) {
                $scope.editedTrip = id;

                if (id != null) {
                    // load data
                }
                else {
                    $scope.tripName = null;
                    $scope.tripDesc = null;
                    $scope.tripFile = null;
                }

                $scope.requested = true;
            };

            $scope.closeEdit = function () {
                $scope.editedTrip = null;
                $scope.requested = false;
            };

            $scope.saveEdit = function (file) {
                if ($scope.editedTrip == null) {
                    // create new trip
                    console.log("creating a trip object: " + $scope.tripName + " " + $scope.tripDesc + " " + file.name);

                    //post request
                    tripsService.insertTripRoute(
                        {
                            name: $scope.tripName,
                            desc: $scope.tripDesc,
                            file: file
                        },
                        function (res) {
                            console.log("ok");
                            console.log(res);
                            $scope.requested = false;
                            window.location = "#/trips";
                        },
                        function (res) {
                            console.log("fail");
                            console.log(res);
                            //$scope.requested = false;
                        }
                    );
                }
                else {
                    // update trip
                    console.log("saving a trip object");
                }
            };

        }])
    .service('TripsService', ['$http', function ($http) {
        var baseUrl = "http://mytrippwapi.azurewebsites.net/api/";

        return {
            getTrips: function (success, error) {
                $http.get(baseUrl + 'Trip?limit=3&offset=0').then(success, error);
            },
            getTrip: function (tripId, success, error) {
                $http.get(baseUrl + 'Trip/getTrip?tripId=' + tripId, {
                    headers: {'Content-Type': 'application/json; charset=utf-8'}
                }).success(success, error);
            },
            insertTripRoute: function (data, success, error) {
                console.log(data.file);

                var fd = new FormData();
                fd.append('file', data.file);

                $http.post(baseUrl + 'Route/create?name=' + data.name + '&description=' + data.desc, fd,
                    { headers: {'Content-Type': undefined} }).then(success, error);
            }
        };
    }]);