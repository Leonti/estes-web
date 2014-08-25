'use strict';

angular.module('estesWebApp').controller('OrdersCtrl', ['$scope', '$interval', 'Order', 'Waiter', 'Dish',
                                                function($scope, $interval, Order, Waiter, Dish) {

	var cols = 4;
	
	var refreshOrders = function() {
		Order.readAll().then(function(orders) {
			orders.sort(function(order1, order2) {
				return Order.getStatusPriority(order1.status) - Order.getStatusPriority(order2.status);
			});		
			$scope.orders = orders;
		});		
	}
	
	refreshOrders();
	
	$scope.calculateTotal = function(order) {
		if (!order) return 0;
		
		var total = 0;
		_.each(order.dishes, function(dish) {
			total += Dish.getPrice(dish);
		});
		return total;
	}
	
	$scope.editOrder = function(order) {
		$scope.order = angular.copy(order);
	}
	
	$scope.onOrderSave = function() {
		refreshOrders();
	}
	
	var ordersPoll = $interval(refreshOrders, 2000);
	$scope.$on('$destroy', function() {
		$interval.$cancel(ordersPoll);
	});
}]);
