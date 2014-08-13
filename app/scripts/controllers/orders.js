'use strict';

/**
 * @ngdoc function
 * @name estesWebApp.controller:OrdersCtrl
 * @description # OrdersCtrl Controller of the estesWebApp
 */
angular.module('estesWebApp').controller('OrdersCtrl', function($scope, Order) {

	var cols = 4;
	
	Order.readAll().then(function(orders) {
		orders.sort(function(order1, order2) {
			return Order.getStatusPriority(order1.status) - Order.getStatusPriority(order2.status);
		});		
		
		$scope.orders = orders;
		
		$scope.partitionedOrders = partition(orders, cols);
	});

	var partition = function(orders, cols) {
		var partitioned = [];
		var itemsInCol = Math.ceil(orders.length / cols);

		for (var col = 0; col < cols; col++) {
			for (var row = 0; row < itemsInCol; row++) {
				if (!partitioned[col]) {
					partitioned[col] = [];
				}
				partitioned[col][row] = orders[cols * (row) + (col)];
			}
		}
		
		console.log(partitioned);
		
		return partitioned;
	}
	
});
