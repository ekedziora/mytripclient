angular.module('media', [])

    .controller('PhotoController', ['$scope', 'PhotoService', 'TripDataShare', function ($scope, photoService, tripDataShare) {
        $scope.getPhotos = function() {
            photoService.getPhotos({tripId: $scope.focusedTrip},
                function(res) {
                    $scope.photos = res.data;
                },
                function(res) {
                    console.log("Failed to load photos for trip: " + $scope.focusedTrip);
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
                    $scope.successAddingNewPhoto = true;
                    $("#" + modalId).modal('hide');
                    $scope.getPhotos();
                },
                function (res) {
                    $scope.successAddingNewPhoto = false;
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
                },
                function(res) {
                    console.log("Failed to load photos for trip: " + $scope.focusedTrip);
                    console.log(res);
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
                    $scope.successAddingNewVideo = true;
                },
                function (res) {
                    $scope.successAddingNewVideo = false;
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