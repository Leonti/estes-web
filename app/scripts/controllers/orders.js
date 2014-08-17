'use strict';

angular.module('estesWebApp').controller('OrdersCtrl', function($scope, Order, Waiter, Dish) {

	var cols = 4;
	$scope.statusList = null;
	$scope.waiterList = null;
	$scope.searchTerm = "";
	$scope.dishList = null;
	$scope.dishListExpanded = false;
	$scope.orderFormDish = null;
	
	Order.readAll().then(function(orders) {
		orders.sort(function(order1, order2) {
			return Order.getStatusPriority(order1.status) - Order.getStatusPriority(order2.status);
		});		
		
		$scope.orders = orders;
		
		$scope.order = orders[0];
		
		$scope.partitionedOrders = partition(orders, cols);
	});

	Order.getStatusList().then(function(statusList) {
		$scope.statusList = statusList;
	});
	
	Waiter.readAll().then(function(waiters) {
		$scope.waiterList = waiters;
	});

	Dish.readAll().then(function(dishList) {
		$scope.dishList = dishList;
	});		
	
	Dish.readAllMenus().then(function(menus) {
		$scope.menus = menus;
		$scope.selectedMenus = angular.copy($scope.menus);	
	});	
	
	$scope.filterDish = function(dish) {
    	var menuFilter = _.some(dish.menus, function(menu) {
    		return $scope.selectedMenus.indexOf(menu) != -1;
    	});	
    
    	function isInSearch(dish) {
    		return $scope.searchTerm.length > 0 ? dish.name.toUpperCase().indexOf($scope.searchTerm.toUpperCase()) != -1: true;
    	}
    	
    	return menuFilter && isInSearch(dish);
	}	
	
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

		return partitioned;
	}
	
	$scope.waiterToLabel = function(waiter) {
		return waiter.name + ' (' + waiter.id + ')';
	}
	
	$scope.toggleDishList = function() {
		$scope.dishListExpanded = !$scope.dishListExpanded;
	}
	
	$scope.addDish = function(dish) {
		$scope.orderFormDish = dish;
	}
});
