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
                var pinUrl = appUrl + '/api/:id/pins';
                $scope.newPin = {};
                $scope.pins = [];
                $scope.tab = 0;


                $scope.getUser = function() {
                UserService.getUser().then(function(result) {
                        $scope.user = result.data;
                    });
                };

                $scope.getUser();

                function loadPins() {
                    $scope.pins = [];
                    $http.get(pinUrl).then(function(response) {
                        var pins = response.data;
                        $scope.pins.push(pins);
                        console.log($scope.pins)
                    });
                };

                loadPins();

                $scope.addPin = function() {
                  console.log("working");
                    if ($scope.newRecord != {}) {
                        $http.post(pinUrl, {
                            'url': $scope.newPin.url,
                            'caption': $scope.newPin.caption
                        }).then(function(response) {
                            loadPins();
                            $scope.newPin = {};
                            $window.location.href = appUrl + "/" +  $scope.user._id + '/';
                        });
                    };
                };


                $scope.deletePin = function(id) {
                  $http({
                        url: recordUrl + "/" + id,
                        method: "DELETE"
                    }).
                    then(function(data) {
                        loadPins();
                    });
                };


                $scope.setTab = function(tab) {
                  $scope.tab = tab;
                };

                $scope.isTab = function(tab) {
                  return tab === $scope.tab;
                };
              }
          ]);

  })();
