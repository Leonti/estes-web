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
    'ui.sortable',
    'angularMoment'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/orders.html',
        controller: 'OrdersCtrl'
      })
      .when('/menu', {
        templateUrl: 'views/menu-editor.html',
        controller: 'MenuEditorCtrl'
      })
      .when('/kitchen', {
        templateUrl: 'views/kitchen.html',
        controller: 'KitchenCtrl'
      })       
      .otherwise({
        redirectTo: '/'
      });
  });
