'use strict';

angular.module('estesWebApp').controller('KitchenCtrl', function($scope, Order, Dish) {
	
	var refreshOrders = function() {
		Order.readAll().then(function(orders) {
			orders.sort(function(order1, order2) {
				return Order.getStatusPriority(order1.status) - Order.getStatusPriority(order2.status);
			});		
			$scope.orders = orders;
		});		
	}
	
	refreshOrders();
	
	$scope.dishDone = function(order, dish) {
		dish.status = 'PREPARED';
		Order.save(order);
	}
	
});
