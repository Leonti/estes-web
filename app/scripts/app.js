'use strict';

/**
 * @ngdoc overview
 * @name estesWebApp
 * @description
 * # estesWebApp
 *
 * Main module of the application.
 */
angular
  .module('estesWebApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.sortable'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/dish/new', {
        templateUrl: 'views/dish.html',
        controller: 'DishCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
