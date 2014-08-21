'use strict';

angular.module('estesWebApp').controller('OrdersCtrl', function($scope, $q, Order, Waiter, Dish) {

	var cols = 4;
	$scope.statusList = null;
	$scope.waiterList = null;
	$scope.searchTerm = "";
	$scope.dishList = null;
	$scope.dishListExpanded = false;
	$scope.orderFormDish = null;
	$scope.addingNewDish = false;
	
	var OrderTemplate = function(status, waiter) {
		return {
			status: status,
			waiter: waiter,
			dishes: [],
			note: null
		}
	}
	
	var refreshOrders = function() {
		Order.readAll().then(function(orders) {
			orders.sort(function(order1, order2) {
				return Order.getStatusPriority(order1.status) - Order.getStatusPriority(order2.status);
			});		
			$scope.orders = orders;
		});		
	}
	
	refreshOrders();

	$q.all({ statuses: Order.getStatusList(), waiters: Waiter.readAll() }).then(function(results) {
		$scope.statusList = results.statuses;
		$scope.waiterList = results.waiters;
		$scope.order = OrderTemplate(results.statuses[0], results.waiters[0]);
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
	
	$scope.waiterToLabel = function(waiter) {
		return waiter.name + ' (' + waiter.id + ')';
	}
	
	$scope.showAddDish = function() {
		$scope.addingNewDish = true;
	}
	
	$scope.hideAddDish = function() {
		$scope.addingNewDish = false;
	}
	
	$scope.toggleDishList = function() {
		$scope.dishListExpanded = !$scope.dishListExpanded;
	}
	
	$scope.configDish = function(dish) {
		$scope.orderFormDish = Dish.toOrderDish(dish);
	}
	
	$scope.addDishToOrder = function(dish) {
		$scope.order.dishes.push(dish);
		$scope.orderFormDish = null;
		$scope.addingNewDish = false;
	}
	
	$scope.cancelAddingDish = function() {
		$scope.orderFormDish = null;
	}
	
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
	
	$scope.save = function(order) {
		resetOrder();
		Order.save(order).then(function() {
			refreshOrders();
		});
	}
	
	$scope.cancel = function() {
		resetOrder();
	}
	
	function resetOrder() {
		$scope.order = OrderTemplate($scope.statusList[0], $scope.waiterList[0]);
	}
});
