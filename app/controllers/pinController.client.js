
(function() {
    angular
    .module('PinController', ['clementinePinApp'])
      .controller('PinCtrl', ['$scope', '$http', '$window', '$location', 'UserService',
          function($scope, $http, $window, $location, UserService) {

            var appUrl = $window.location.origin;
            var pinUrl = appUrl + '/api/:id/pins';
            $scope.newPin = {};
            $scope.myPins = [];
            $scope.publicUserPins = [];
            $scope.pins = [];
            $scope.tab = 0;

            $scope.changeLocation = function(url) {
              $location.path(url);
            };

            $scope.getUser = function() {
                    UserService.getUser().then(function(result) {
                            $scope.user = result.data;
                        });
                    };

            $scope.getUser();

            function sortMyPins(pins) {
              if ($scope.user === undefined){
                return;
              }
              for (var x = 0; x < pins.length; x++) {
                if (pins[x].owner === $scope.user._id) {
                  $scope.myPins.push(pins[x]);
                }
              }
            }

            function loadPins() {
              $scope.pins = [];
              $http.get(pinUrl).then(function(response) {
                var pins = response.data;
                $scope.pins = pins;
                sortMyPins(pins);
              });
            }


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
                  $scope.getPublicPins($scope.user._id);
                });
              }
            };


            $scope.deletePin = function(id) {
              $http({
                url: "/api/pins/" + id,
                method: "DELETE"
              }).
              then(function(data) {
                $window.location.href = appUrl + "/" + $scope.user._id + '/pins';
              });
            };


            $scope.getPublicPins = function(user) {
              $scope.publicUserPins = [];
              $http({
                  url: "/api/public/pins/" + user,
                  method: "get"
                })
                .then(function(response) {
                  var userPins = response.data;
                  $scope.$apply(function (){
                    $scope.publicUserPins = userPins;
                    console.log($scope.publicUserPins);
                    $location.path("/pins/public/" + user);
                  });

                });
            };

            $scope.hasUrl = function(newPin) {
              if (newPin.url) {
                return true;
              }
            };

          }]);

      })();
