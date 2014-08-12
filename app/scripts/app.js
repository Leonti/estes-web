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
        templateUrl: 'views/orders.html',
        controller: 'OrdersCtrl'
      })
      .when('/menu', {
        templateUrl: 'views/menu-editor.html',
        controller: 'MenuEditorCtrl'
      })      
      .otherwise({
        redirectTo: '/'
      });
  });
