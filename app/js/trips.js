angular.module('trips', ['uiGmapgoogle-maps'])

    .config(['uiGmapGoogleMapApiProvider',
        function (uiGmapGoogleMapApiProvider) {

            uiGmapGoogleMapApiProvider.configure({
                //key, hmm
                v: '3.20',
                libraries: 'weather,geometry,visualization'
            });

        }])

    .controller('TripsController', ['$scope', '$filter', 'uiGmapGoogleMapApi', 'TripsService', '$routeParams', 'TripDataShare', 'Utils',
        function ($scope, $filter, uiGmapGoogleMapApi, tripsService, $routeParams, tripDataShare, utils) {

            var tripsPreviewSize = 3;
            var tripsLoadingSize = 12;

            $scope.focusedTrip = $routeParams.id;
            tripDataShare.tripId = $routeParams.id;

            $scope.requestTrips = function () {
                tripsService.getTrips({offset: 0, limit: ($scope.public ? tripsPreviewSize + 1 : tripsPreviewSize), public: ($scope.public ? true : false)},
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

            if ($scope.focusedTrip) {
                tripsService.getTrip($scope.focusedTrip,
                    function (res) {
                        $scope.trip = res;
                        if(res['RouteStatus'] == 1) {
                            utils.prepareMapForRoute($scope, res['Route']['points'], uiGmapGoogleMapApi, true);
                            uiGmapGoogleMapApi.then(function (maps) {
                                $scope.map =
                                {
                                    center: {
                                        latitude: 52,
                                        longitude: 20
                                    },
                                    zoom: 6,
                                    markers: $scope.markers
                                };
                            });
                            console.log("Trip has been loaded successfully");
                            console.log(res);
                        } else if(res['RouteStatus'] == 0) {
                            console.log("Trip routes formatting is in progress");
                            console.log(res);
                            $scope.tripFormattingStatus = "Trip routes formatting is in progress, map cannot be loaded now.";
                        } else if(res['RouteStatus'] == 2) {
                            console.log("Trip data has invalid format, could not load");
                            console.log(res);
                            $scope.tripFormattingStatus = "Trip data has invalid format, could not load the map.";
                        }
                    },
                    function (res) {
                        console.log(res);
                    }
                )
            }
            else {
                $scope.requestTrips();
            }

            $scope.public = false;

            $scope.togglePublic = function (status) {
                if ($scope.public != status) {
                    $scope.public = status;
                    $scope.requestTrips();
                }
            };

            $scope.toggleTripsGallery = function () {
                if ($scope.galleryVisible) {
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

            $scope.moreTrips = function () {
                var offset = ($scope.public ? tripsPreviewSize + 1 : tripsPreviewSize) + ($scope.trips ? $scope.trips.length : 0);
                console.log('offset: ' + offset);
                tripsService.getTrips({offset: offset, limit: tripsLoadingSize, public: $scope.public},
                    function (res) {

                        // If loaded last [res.data.size] trips,
                        // hide 'load more' button
                        $scope.galleryMore = (res.data.size < tripsLoadingSize);

                        $scope.trips = $scope.trips ? $scope.trips.concat(res.data) : res.data;
                    },
                    function (res) {
                        console.log(res);
                    }
                );
            };

            $scope.shareTrip = function(trip) {
                tripsService.editTrip({id: trip.id, share: !trip.isPublic},
                    function(res) {
                        trip.isPublic = !trip.isPublic;
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

            $scope.moveWaypointUp = function (id) {
                utils.swapArrayElements($scope.waypoints, id, id - 1);
                $scope.waypointsChanged = true;
                utils.refreshWaypointsOnMap($scope, uiGmapGoogleMapApi);
            };

            $scope.moveWaypointDown = function (id) {
                utils.swapArrayElements($scope.waypoints, id, id + 1);
                $scope.waypointsChanged = true;
                utils.refreshWaypointsOnMap($scope, uiGmapGoogleMapApi);
            };

            $scope.removeWaypoint = function (id) {
                $scope.waypoints.splice(id, 1);
                $scope.waypointsChanged = true;
                utils.refreshWaypointsOnMap($scope, uiGmapGoogleMapApi);
                //TODO markery sie nie usuwaja?
            };

            $scope.saveChangedWaypoints = function () {
                delete $scope.updateRouteSuccessful;
                var updatedRoute = utils.refreshWaypointsOnMap($scope, uiGmapGoogleMapApi);
                tripsService.editTripRoute(
                    {
                        route: updatedRoute,
                        tripId: $scope.focusedTrip
                    },
                    function (res) {
                        console.log(res);
                        $scope.updateRouteSuccessful = true;
                    },
                    function (res) {
                        console.log(res);
                        $scope.updateRouteSuccessful = false;
                    }
                );
            };

        }])
    .controller('EditTripController', ['$scope', '$filter', 'TripsService',
        function ($scope, $filter, tripsService) {

            $scope.setFile = function (file) {
                $scope.tripFile = file.files[0];
            };

            $scope.openEdit = function (id) {
                console.log('Edit request');

                $scope.editedTrip = id;

                if (id != null) {
                    // load data
                    console.log(id);
                    $scope.tripName = id.Name;
                    $scope.tripDesc = id.Description;
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
                    fd, {headers: {'Content-Type': undefined}}
                ).then(success, error);
            },
            editTrip: function(data, success, error) {
                console.log('request trip edit: ');
                console.log(data);

                $http.post(baseUrl
                    + 'Trip/editTrip?id='
                    + data.id
                    + (data.share != null ? '&isPublic=' + data.share : '')
                    + (data.name != null ? '&name=' + data.name : '')
                    + (data.desc != null ? '&description=' + data.desc : '')
                ).then(success, error);
            },
            editTripRoute: function(data, success, error) {
                console.log(data);

                //var fd = new FormData();
                //fd.append('route', angular.toJson(data.route));

                $http.post(baseUrl
                    + 'Trip/editRoute?id='
                    + data.tripId,
                    angular.toJson(data.route), {headers: {'Content-Type': "application/json"}}
                ).then(success, error);
            }
        };
    }])

    .factory('Utils', function () {
        return {
            swapArrayElements: function (arr, indexA, indexB) {
                var temp = arr[indexA];
                arr[indexA] = arr[indexB];
                arr[indexB] = temp;
            },
            prepareMapForRoute: function ($scope, routes, uiGmapGoogleMapApi, initMap) {
                $scope.trackings = [{
                    id: 1,
                    geotracks: []
                }];

                $scope.markers = [];
                //mapping trips from response to map markers
                angular.forEach(routes, function (val, index) {
                    $scope.markers.push({
                        id: Date.now(),//todo a na co to komu było?
                        coords: {
                            latitude: val.latitude,
                            longitude: val.longitude,
                            city: val.city
                        },
                        options: {
                            labelContent : '#'+ (index+1)+ ": " +val.city,
                            labelAnchor: '15 61',
                            labelStyle: {
                                "font-size": "120%",
                                "border": "1px solid grey",
                                "background": "white"
                            },
                            labelInBackground: false
                        }
                    });
                    //setting trackings
                    $scope.trackings[0].geotracks.push(
                        {
                            latitude: val.latitude,
                            longitude: val.longitude
                        }
                    );
                });


                $scope.map = {
                    markers: $scope.markers
                };//TODO nie wiem czemu te markery nie zawsze sie usuwaja na mapie, ale ogolnie usuwanie dziala
            },

            refreshWaypointsOnMap: function ($scope, uiGmapGoogleMapApi) {
                var changedWaypoints = [];
                var routePointsToUpdate = [];
                angular.forEach($scope.waypoints, function (val) {
                    this.push({
                        latitude: val.coords.latitude,
                        longitude: val.coords.longitude,
                        city: val.coords.city,
                        options: val.options
                    });
                    routePointsToUpdate.push(
                        {
                            latitude: val.coords.latitude,
                            longitude: val.coords.longitude,
                            city: val.coords.city
                        }
                    );
                }, changedWaypoints);
                this.prepareMapForRoute($scope, changedWaypoints, uiGmapGoogleMapApi, false);

                var updatedRoute = $scope.trip['Route'];
                updatedRoute['points'] = routePointsToUpdate;
                return updatedRoute;
            }
        };
    })

    .factory('TripDataShare', function () {
        return {tripId: ''};
    })
;
