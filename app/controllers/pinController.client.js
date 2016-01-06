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
                $scope.myPins = [];
                $scope.publicUserPins = [];
                $scope.pins = [];
                $scope.tab = 0;


                function getUser() {
                UserService.getUser().then(function(result) {
                        $scope.user = result.data;
                    });
                };

                function sortMyPins(pins){
                  for (var x=0; x < pins.length; x++){
                    if(pins[x].owner === $scope.user._id){
                      $scope.myPins.push(pins[x]);
                    };
                  }
                }

                function loadPins() {
                    $scope.pins = [];
                    $http.get(pinUrl).then(function(response) {
                        var pins = response.data;
                        $scope.pins = pins;
                        sortMyPins(pins);
                    });
                };

                getUser();
                loadPins();


                $scope.addPin = function() {
                    if ($scope.newRecord != {}) {
                        $http.post(pinUrl, {
                            'url': $scope.newPin.url,
                            'caption': $scope.newPin.caption,
                            "owner": $scope.user._id
                        }).then(function(response) {
                            loadPins();
                            $scope.newPin = {};
                          $window.location.href = appUrl + "/" +  $scope.user._id + '/pins';
                        });
                    };
                };


                $scope.deletePin = function(id) {
                  $http({
                        url: "/api/pins/" + id,
                        method: "DELETE"
                    }).
                    then(function(data) {
                      $window.location.href = appUrl + "/" +  $scope.user._id + '/pins';
                    });
                };


                $scope.getPublicPins = function(user){
                  $scope.publicUserPins = [];
                  $http({
                        url: "/api/public/pins/" + user,
                        method: "get"
                    })
                    .then(function(response) {
                        var userPins = response.data;
                        console.log(userPins)
                        $scope.publicUserPins.push(userPins);
                        console.log($scope.publicUserPins)
                        $location.path("/pins/public/" + user);
                    });
                };

                $scope.hasUrl = function () {
                  if (newPin.url){
                    return true;
                  }
                };

                $scope.isLoggedIn = function (){
                  if ($scope.user._id === undefined){
                    return false;
                  }else{
                    return true;
                  }
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
