'use strict';

angular.module('estesWebApp').directive('orderForm', ['Waiter', 'Dish', 'Order', 
                                              function(Waiter, Dish, Order) {

	var OrderTemplate = function(waiter) {
		return {
			status: 'PREPARATION',
			waiter: waiter,
			dishes: [],
			note: null
		}
	}
	
	return {
		templateUrl : 'views/directives/order-form.html',
		replace: true,
		restrict : 'E',
		scope: {
			order: '=',
			onSave: '&'
		},
		link : function postLink($scope, element, attrs) {
			
			$scope.waiterList = null;
			$scope.searchTerm = "";
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
				$scope.order = OrderTemplate(waiters[0]);
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
				$scope.orderFormDish = Order.toOrderDish(dish);
			}
			
			$scope.addDishToOrder = function(dish) {
				$scope.order.dishes.push(dish);
				$scope.orderFormDish = null;
				$scope.addingNewDish = false;
			}
			
			$scope.cancelAddingDish = function() {
				$scope.orderFormDish = null;
			}
			
			$scope.calculateSubtotal = function(order) {
				if (!order) return 0;
				
				return Order.calculatePrice(order);
			}
	
			$scope.calculateTax = function(order) {
				if (!order) return 0;
				
				return Math.round(Order.calculateTax(order) * 100) / 100;
			}
			
			$scope.save = function(order) {
				resetOrder();
				Order.save(order).then(function() {
					$scope.onSave();
				});
			}
			
			$scope.paid = function(order) {
				order.status = 'PAID';
				$scope.save(order);
			}
			
			$scope.cancel = function() {
				resetOrder();
			}
			
			$scope.forcePayment = function() {
				viewOverride = 'PAYMENT';
			}

			$scope.forceEdit = function() {
				viewOverride = 'EDIT';
			}
			
			$scope.isEditView = function() {
				if (viewOverride == 'PAYMENT') return false;
				return $scope.order.status == 'PREPARATION' || viewOverride == 'EDIT';
			}
			
			$scope.isPaymentView = function() {
				if (viewOverride == 'EDIT') return false;
				return $scope.order.status != 'PREPARATION' || viewOverride == 'PAYMENT';
			}
			
			function resetOrder() {
				$scope.order = OrderTemplate($scope.waiterList[0]);
			}
		}
	};
}]);
