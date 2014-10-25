'use strict';

angular.module('estesWebApp').controller('OrdersCtrl', ['$scope', '$interval', 'Order',
                                                function($scope, $interval, Order) {

	var refreshOrders = function() {
		Order.readAll().then(function(orders) {
			orders.sort(function(order1, order2) {
				return Order.getStatusPriority(order1.status) - Order.getStatusPriority(order2.status);
			});		
			$scope.orders = orders;
		});
	};
	
	refreshOrders();
	
	$scope.order = null;
	$scope.addingOrder = false;
	
	$scope.addOrder = function() {
		$scope.addingOrder = true;
	}
	
	$scope.onOrderSave = function(order) {
		console.log(order);
		$scope.addingOrder = false;
		refreshOrders();
	}
	
	$scope.onNewOrderCancel = function() {
		$scope.addingOrder = false;
	}
	
	var ordersPoll = $interval(refreshOrders, 2000);
	$scope.$on('$destroy', function() {
		$interval.$cancel(ordersPoll);
	});
}]);
