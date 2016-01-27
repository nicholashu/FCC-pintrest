'use strict';

(function() {

  angular.module('clementinePinApp', ['ngRoute', 'PinController', 'masonry'])
    .config(['$routeProvider',
      function($routeProvider) {
        $routeProvider.
        when('/', {
          templateUrl: '/public/views/mainview.html'
        }).
        when('/newpin', {
          templateUrl: '/public/views/newpin.html'
        }).
        when('/pins/public/:id', {
          templateUrl: '/public/views/mypins.html'
        }).
        otherwise('/');
      }
    ])
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
        .directive('fallbackSrc', function() {
        	return {
            restrict: 'A',
            link: function(scope, element, attrs){
        			if(_.isEmpty(attrs.ngSrc)){
        				element.attr('src', attrs.fallbackSrc);
        			}
        			element.bind('error', function(){
        				element.attr('src', attrs.fallbackSrc);
        			});
            }
          };
        })
      .controller('MainCtrl', ['$scope', '$http','$location',  'UserService', function($scope, $http, $location, UserService) {

        $scope.changeLocation = function(url) {
          $location.path(url);
        };

        $scope.getUser = function() {
                UserService.getUser().then(function(result) {
                        $scope.user = result.data;
                    });
                };

        $scope.getUser();


        $scope.isLoggedIn = function() {
          if ($scope.user === undefined) {
            return false;
          }
          if ($scope.user._id === undefined) {
            return false;
          } else {
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
