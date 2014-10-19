'use strict';

angular.module(
		'estesWebApp',
		[ 'ngAnimate', 'ngCookies', 'ngResource', 'ngRoute', 'ngSanitize', 'ngTouch', 'ui.sortable', 'angularMoment','angularLocalStorage', 'restangular' ])
		.config([ '$routeProvider', function($routeProvider) {

			$routeProvider.when('/', {
				templateUrl : 'views/dashboard.html',
				controller : 'DashboardCtrl'
			}).when('/orders', {
				templateUrl : 'views/orders.html',
				controller : 'OrdersCtrl'
			}).when('/articles', {
				templateUrl : 'views/articles.html',
				controller : 'ArticlesCtrl'
			}).when('/kitchen', {
				templateUrl : 'views/kitchen.html',
				controller : 'KitchenCtrl'
			}).when('/settings', {
				templateUrl : 'views/settings.html',
				controller : 'SettingsCtrl'
			}).when('/demo', {
				templateUrl : 'views/demo.html',
				controller : 'DemoCtrl'
			}).when('/login', {
				templateUrl : 'views/login.html',
				controller : 'LoginCtrl'
			}).when('/logout', {
				templateUrl : 'views/logout.html',
				controller : 'LogoutCtrl'
			}).otherwise({
				redirectTo : '/'
			});
			
		} ]);
