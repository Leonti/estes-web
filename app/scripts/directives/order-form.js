'use strict';
/*global _:false */

angular.module('estesWebApp').directive('orderForm', ['Waiter', 'Dish', 'Order', 'Printer', 
                                              function(Waiter, Dish, Order, Printer) {

	var OrderTemplate = function(waiter) {
		return {
			status: 'PREPARATION',
			waiter: waiter,
			dishes: [],
			note: null
		};
	};
	
	return {
		templateUrl : 'views/directives/order-form.html',
		replace: true,
		restrict : 'E',
		scope: {
			order: '=',
			onSave: '&'
		},
		link : function postLink($scope) {
			
			$scope.waiterList = null;
			$scope.searchTerm = '';
			$scope.dishList = null;
			$scope.dishListExpanded = false;
			$scope.orderFormDish = null;
			$scope.addingNewDish = false;
			var viewOverride = null;
			
			$scope.$watch('order', function() {
				viewOverride = null;
			});
			
			Waiter.readAll().then(function(waiters) {
				$scope.waiterList = waiters;
				$scope.order = new OrderTemplate(waiters[0]);
			});

			Dish.readAll().then(function(dishList) {
				$scope.dishList = dishList;
				
				$scope.menus = Dish.getMenus(dishList);
				$scope.selectedMenus = angular.copy($scope.menus);
			});
			
			$scope.filterDish = function(dish) {
		    	var menuFilter = _.some(dish.menus, function(menu) {
		    		return $scope.selectedMenus.indexOf(menu) !== -1;
		    	});	
		    
		    	function isInSearch(dish) {
		    		return $scope.searchTerm.length > 0 ? dish.name.toUpperCase().indexOf($scope.searchTerm.toUpperCase()) !== -1 : true;
		    	}
		    	
		    	return menuFilter && isInSearch(dish);
			};	
			
			$scope.waiterToLabel = function(waiter) {
				return waiter.name;
			};
			
			$scope.showAddDish = function() {
				$scope.addingNewDish = true;
			};
			
			$scope.hideAddDish = function() {
				$scope.addingNewDish = false;
			};
			
			$scope.toggleDishList = function() {
				$scope.dishListExpanded = !$scope.dishListExpanded;
			};
			
			$scope.configDish = function(dish) {		
				$scope.orderFormDish = Order.toOrderDish(dish);
			};
			
			$scope.addDishToOrder = function(dish) {
				$scope.order.dishes.push(dish);
				$scope.orderFormDish = null;
				$scope.addingNewDish = false;
			};
			
			$scope.cancelAddingDish = function() {
				$scope.orderFormDish = null;
			};
			
			$scope.calculateSubtotal = function(order) {
				if (!order) { return 0; }
				
				return Order.calculatePrice(order, Dish.getPrice);
			};
	
			$scope.calculateTax = function(order) {
				if (!order) { return 0; }
				
				return Math.round(Order.calculateTax(order, Dish.getPrice) * 100) / 100;
			};
			
			$scope.save = function(order) {
				resetOrder();
				Order.save(order).then(function() {
					$scope.onSave();
				});
			};
			
			$scope.paid = function(order) {
				order.status = 'PAID';
				$scope.save(order);
			};
			
			$scope.cancel = function() {
				resetOrder();
			};
			
			$scope.forcePayment = function() {
				viewOverride = 'PAYMENT';
			};

			$scope.forceEdit = function() {
				viewOverride = 'EDIT';
			};
			
			$scope.isEditView = function() {
				if (viewOverride === 'PAYMENT') { return false; }
				return $scope.order.status === 'PREPARATION' || viewOverride === 'EDIT';
			};
			
			$scope.isPaymentView = function() {
				if (viewOverride === 'EDIT') { return false; }
				return $scope.order.status !== 'PREPARATION' || viewOverride === 'PAYMENT';
			};
			
			$scope.print = function(order) {
				Printer.print(order);
			};
			
			function resetOrder() {
				$scope.order = new OrderTemplate($scope.waiterList[0]);
			}
		}
	};
}]);
