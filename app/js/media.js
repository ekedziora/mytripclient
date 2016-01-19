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

        $scope.deletePhoto = function() {
            photoService.deletePhoto({photoId: $scope.deletePhotoId},
                function (res) {
                    $scope.successDeletingPhoto = true;
                    $scope.getPhotos();
                },
                function (res) {
                    $scope.successDeletingPhoto = false;
                }
            )
        };

        $scope.setFile = function(photoFile) {
            $scope.photoFile=photoFile.files[0];
        };

        $scope.setDeletePhotoId = function(deletePhotoId) {
          $scope.deletePhotoId = deletePhotoId;
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
            },
            deletePhoto: function (data, success, error) {
                $http.delete(baseUrl + 'Media/deletePhoto?' + $.param(data)).then(success, error);
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

        $scope.deleteMovie = function() {
            videoService.deleteMovie({movieId: $scope.deleteMovieId},
                function (res) {
                    $scope.successDeletingMovie = true;
                    $scope.getMovies();
                },
                function (res) {
                    $scope.successDeletingMovie = false;
                }
            )
        };

        $scope.setFile = function(videoFile) {
            $scope.videoFile = videoFile.files[0];
        };

        $scope.setDeleteMovieId = function(deleteMovieId) {
            $scope.deleteMovieId = deleteMovieId;
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
            },
            deleteMovie: function (data, success, error) {
                $http.delete(baseUrl + 'Media/deleteMovie?' + $.param(data)).then(success, error);
            }
        };
    }]);