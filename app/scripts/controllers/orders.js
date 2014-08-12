'use strict';

/**
 * @ngdoc function
 * @name estesWebApp.controller:OrdersCtrl
 * @description
 * # OrdersCtrl
 * Controller of the estesWebApp
 */
angular.module('estesWebApp').controller('OrdersCtrl', function ($scope, Order) {

	Order.readAll().then(function(orders) {
		$scope.orders = orders;
	});
	
});
