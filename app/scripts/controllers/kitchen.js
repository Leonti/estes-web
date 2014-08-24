'use strict';

angular.module('estesWebApp').controller('KitchenCtrl', ['$scope', '$interval', 'Order', 'Dish', 
                                                 function($scope, $interval, Order, Dish) {
	
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
		Order.save(order).then(function() {
			refreshOrders();
		});
	}
	
	$scope.filterOrder = function(order) {
		var hasDishes = order.dishes.length > 0;
		
		return hasDishes && order.status == 'PREPARATION';
	}
	
	var ordersPoll = $interval(refreshOrders, 2000);
	$scope.$on('$destroy', function() {
		$interval.$cancel(ordersPoll);
	});
	
}]);
