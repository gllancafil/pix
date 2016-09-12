'use strict';

var app = angular.module('pix', [])
app.controller('MainController', MainController);

function MainController($scope) {
  $scope.message = 'Angular Works!'
}
