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

            var tripsPreviewSize = 3;
            var tripsLoadingSize = 12;

            $scope.focusedTrip = $routeParams.id;

            $scope.requestTrips = function() {
                tripsService.getTrips({offset: 0, limit: tripsPreviewSize, public: ($scope.public ? true : false)},
                    function (res) {
                        //res mocked for now
                        console.log(res);
                        //res = mockedTripsResponse;
                        $scope.preview = res.data;
                        $scope.trips = [];
                        $scope.photo = $filter('filter')(mockedPhotos, {
                            tripId: 1,//res.data[0].Id,
                            defaultBigThumbnail: true
                        }, true);
                    },
                    function (res) {
                        console.log(res);
                    }
                );
            };

            if($scope.focusedTrip) {
                tripsService.getTrip($scope.focusedTrip,
                    function (res) {
                        $scope.trip = res;
                    },
                    function (res) {
                        $scope.trip = res;
                        console.log(res);
                    }
                )
            }
            else {
                $scope.requestTrips();
            }

            $scope.public = false;
            
            $scope.togglePublic = function(status) {
                if($scope.public != status) {
                    $scope.public = status;
                    $scope.requestTrips();
                }
            };

            $scope.toggleTripsGallery = function() {
                if($scope.galleryVisible) {
                    // Reset previously loaded trips
                    $scope.trips = [];
                    $scope.galleryVisible = false;
                }
                else {
                    // Request [tripsLoadingSize] trips
                    $scope.moreTrips();
                    $scope.galleryVisible = true;
                }
            };

            $scope.moreTrips = function() {
                var offset = tripsPreviewSize + ($scope.trips ? $scope.trips.length : 0);
                console.log('offset: '+offset);
                tripsService.getTrips({offset: offset, limit: tripsLoadingSize},
                    function(res) {

                        // If loaded last [res.data.size] trips,
                        // hide 'load more' button
                        $scope.galleryMore = (res.data.size < tripsLoadingSize);

                        $scope.trips = $scope.trips ? $scope.trips.concat(res.data) : res.data;
                    },
                    function(res) {
                        console.log(res);
                    }
                );
            };

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

            $scope.moveWaypointUp = function(id) {
                tripsService.swapArrayElements($scope.waypoints, id, id-1);
                $scope.waypointsChanged = true;
            };

            $scope.moveWaypointDown = function(id) {
                tripsService.swapArrayElements($scope.waypoints, id, id+1);
                $scope.waypointsChanged = true;
            };

            $scope.removeWaypoint = function(id) {
                $scope.waypoints.splice(id, 1);
                $scope.waypointsChanged = true;
            };

            $scope.saveChangedWaypoints = function() {
                //TODO changeRoutePointsOrder($scope.waypoints)
            };

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
                    $scope.tripPublic = false;
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
                            public: $scope.tripPublic,
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
            getTrips: function (data, success, error) {
                $http.get(baseUrl
                    + 'Trip?offset='
                    + (data.offset ? data.offset : 0)
                    + '&limit='
                    + (data.limit ? data.limit : 0)
                    + '&isPublic='
                    + (data.public ? 'true' : 'false')
                ).then(success, error);
            },
            getTrip: function (tripId, success, error) {
                $http.get(baseUrl + 'Trip/getTripInfo?id=' + tripId, {
                    headers: {'Content-Type': 'application/json; charset=utf-8'}
                }).success(success, error);
            },
            insertTripRoute: function (data, success, error) {
                console.log(data.file);

                var fd = new FormData();
                fd.append('file', data.file);

                $http.post(baseUrl
                    + 'Route/create?name='
                    + data.name
                    + '&description='
                    + data.desc
                    + '&isPublic=false',
                    fd, { headers: {'Content-Type': undefined} }
                ).then(success, error);
            },//todo
            swapArrayElements: function(arr, indexA, indexB) {
                var temp = arr[indexA];
                arr[indexA] = arr[indexB];
                arr[indexB] = temp;
            }
        };
    }]);