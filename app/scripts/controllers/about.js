'use strict';

/**
 * @ngdoc function
 * @name estesWebApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the estesWebApp
 */
angular.module('estesWebApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
