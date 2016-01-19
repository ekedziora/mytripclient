angular.module('media', [])

    .controller('PhotoController', ['$scope', 'PhotoService', 'TripDataShare', function ($scope, photoService, tripDataShare) {
        $scope.getPhotos = function() {
            console.log("Get photos for trip: " + $scope.focusedTrip);
            photoService.getPhotos({tripId: $scope.focusedTrip},
                function(res) {
                    $scope.photos = res.data;
                    console.log(res)
                },
                function(res) {
                    console.log(res);
                }
            );
        };

        $scope.addPhoto = function (photoFile, modalId) {
            console.log("Adding new file for trip: " + tripDataShare.tripId);
            console.log(photoFile);
            photoService.addPhoto(
                {
                    id: 1,//TODO ma nie byc wysylane
                    tripId: tripDataShare.tripId,
                    file: photoFile
                },
                function (res) {
                    console.log("Successfully added the file!");
                    $scope.successAddingNewPhoto = true;
                    $("#" + modalId).modal('hide');
                    $scope.getPhotos();
                    console.log(res);
                },
                function (res) {
                    console.log("Failure adding the file!");
                    $scope.successAddingNewPhoto = false;
                    console.log(res);
                }
            );
        };

        $scope.setFile = function(photoFile) {
            $scope.photoFile=photoFile.files[0];
        };

        $scope.getPhotos();
    }])

    .service('PhotoService', ['$http', function ($http) {
        var baseUrl = "http://mytrippwapi.azurewebsites.net/api/";

        return {
            addPhoto: function (data, success, error) {
                var fd = new FormData();
                fd.append('file', data.file);

                $http.post(baseUrl + 'Media/addPhoto?id=' + data.id + '&tripId=' + data.tripId, fd,
                    {headers: {'Content-Type': undefined}}).then(success, error);
            },
            getPhotos: function(data, success, error) {
                $http.get(baseUrl + 'Media/getPhotos?tripId=' + data.tripId).then(success, error);
            }
        };
    }])

    .controller('VideoController', ['$scope', 'VideoService', 'TripDataShare', function ($scope, videoService, tripDataShare) {
        $scope.getMovies = function() {
            videoService.getMovies({tripId: $scope.focusedTrip},
                function(res) {
                    $scope.movies = res.data;
                    console.log($scope.focusedTrip);
                },
                function(res) {
                    console.log($scope.focusedTrip);
                }
            );
        };

        $scope.addVideo = function (videoFile, modalId) {
            videoService.addVideo(
                {
                    id: 1,//TODO do usunięcia
                    tripId: tripDataShare.tripId,
                    file: videoFile
                },
                function (res) {
                    $("#" + modalId).modal('hide');
                    $scope.getMovies();
                    console.log("Successfully added the file!");
                },
                function (res) {
                    console.log("Failure adding the file!");
                }
            );
        };

        $scope.setFile = function(videoFile) {
            $scope.videoFile = videoFile.files[0];
        };

        $scope.getMovies();
    }])

    .service('VideoService', ['$http', function ($http) {
        var baseUrl = "http://mytrippwapi.azurewebsites.net/api/";

        return {
            addVideo: function (data, success, error) {
                var fd = new FormData();
                fd.append('file', data.file);

                $http.post(baseUrl + 'Media/addMovie?id=' + data.id + '&tripId=' + data.tripId, fd,
                    {headers: {'Content-Type': undefined}}).then(success, error);
            },
            getMovies: function(data, success, error) {
                $http.get(baseUrl + 'Media/getMovies?tripId=' + data.tripId).then(success, error);
            }
        };
    }]);