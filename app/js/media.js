angular.module('media', [])

    .controller('PhotoController', ['$scope', 'PhotoService', 'TripDataShare', function ($scope, photoService, tripDataShare) {
        $scope.addPhoto = function (photoFile) {
            console.log("Adding new file for trip: "+tripDataShare.tripId);
            console.log(photoFile);
            photoService.addPhoto(
                {
                    id: 1,//TODO ma nie byc wysylane
                    tripId: tripDataShare.tripId,
                    file: photoFile
                },
                function (res) {
                    console.log("Successfully added the file!");
                    console.log(res);
                },
                function (res) {
                    console.log("Failure adding the file!");
                    console.log(res);
                }
            );
        };

        $scope.setFile = function(photoFile) {
            $scope.photoFile=photoFile.files[0];
        };
    }])

    .service('PhotoService', ['$http', function ($http) {
        var baseUrl = "http://mytrippwapi.azurewebsites.net/api/";

        return {
            addPhoto: function (data, success, error) {
                var fd = new FormData();
                fd.append('file', data.file);

                $http.post(baseUrl + 'Media/addPhoto?id=' + data.id + '&tripId=' + data.tripId, fd,
                    {headers: {'Content-Type': undefined}}).then(success, error);
            }
        };
    }])

    .controller('VideoController', ['$scope', 'VideoService', function ($scope, videoService) {
        //TODO
    }])

    .service('VideoService', ['$scope', function ($scope) {
        //TODO

        return {
            //TODO
        };
    }]);