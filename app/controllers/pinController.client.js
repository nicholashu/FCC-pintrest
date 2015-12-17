'use strict';

(function() {
    angular
        .module('clementinePinApp', [])
        .service('UserService', ['$http', '$window', '$q', function($http, $window, $q) {

        var appUrl = $window.location.origin;
        var apiUrl = appUrl + '/api/:id';

        var deferred = $q.defer();

        this.getUser = function() {
            $http.get(apiUrl).then(function(result) {
                deferred.resolve(result);
            });

            return deferred.promise;
        };


    }])
        .controller('PinCtrl', ['$scope', '$http', '$window','UserService','$location',

            function($scope, $http, $window, UserService, $location) {

                var appUrl = $window.location.origin;
                var recordUrl = appUrl + '/api/:id/record';
                $scope.tab = 0;


                $scope.getUser = function() {
                UserService.getUser().then(function(result) {
                        $scope.user = result.data;
                    });
                };

                $scope.getUser();

                function loadRecords() {
                    $scope.records = [];
                    $scope.awaitingArray = [];
                    $scope.onLoan = [];
                    $http.get(recordUrl).then(function(response) {
                        var records = response.data;
                        getRecords(records);
                    });
                };

                function getRecords(records){
                  records.forEach(function(record){
                    if (record.owner === $scope.user._id ){
                      $scope.myRecords.push(record);
                    }
                      $scope.records.push(record);
                  });
                 }


                loadRecords();


                $scope.addRecord = function() {
                    if ($scope.newRecord != {}) {
                        $http.post(recordUrl, {
                            'album': $scope.newRecord.album,
                            'artist': $scope.newRecord.artist,
                            'condition': $scope.newRecord.condition,
                            'description': $scope.newRecord.description,
                            'owner': $scope.user._id,
                            'loaner': ""

                        }).then(function(response) {
                            loadRecords();
                            $scope.newRecord = {};
                            $window.location.href = appUrl + "/" +  $scope.user._id + '/records';
                        });
                    }
                };


                $scope.deleteRecord = function(id) {
                    $http({
                        url: recordUrl + "/" + id,
                        method: "DELETE"
                    }).
                    then(function(data) {
                        loadRecords();
                    });
                };


                $scope.setTab = function(tab) {
                  $scope.tab = tab;
                };

                $scope.isTab = function(tab) {
                  return tab === $scope.tab;
                };



})();
