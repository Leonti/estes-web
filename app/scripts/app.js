'use strict';

angular.module(
		'estesWebApp',
		[ 'ngAnimate', 'ngCookies', 'ngResource', 'ngRoute', 'ngSanitize', 'ngTouch', 'ui.sortable', 'angularMoment','angularLocalStorage', 'restangular' ])
		.config([ '$routeProvider', function($routeProvider) {

			$routeProvider.when('/', {
				templateUrl : 'views/startpage.html',
				controller : 'StartPageCtrl'
			}).when('/orders', {
				templateUrl : 'views/orders.html',
				controller : 'OrdersCtrl'
			}).when('/articles', {
				templateUrl : 'views/articles.html',
				controller : 'ArticlesCtrl'
			}).when('/kitchen', {
				templateUrl : 'views/kitchen.html',
				controller : 'KitchenCtrl'
			}).when('/dashboard', {
				templateUrl : 'views/dashboard.html',
				controller : 'DashboardCtrl'
			}).when('/settings', {
				templateUrl : 'views/settings.html',
				controller : 'SettingsCtrl'
			}).when('/history', {
				templateUrl : 'views/history.html',
				controller : 'HistoryCtrl'
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
