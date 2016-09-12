;(function(angular) {
'use strict';

MainController.$inject = ["$scope"];
var app = angular.module('pix', [])
app.controller('MainController', MainController);

function MainController($scope) {
  $scope.message = 'Angular Works!'
}

})(angular);