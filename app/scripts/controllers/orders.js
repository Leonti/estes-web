'use strict';

angular.module('estesWebApp').controller('OrdersCtrl', ['$scope', '$interval', 'Order', 'Event',
                                                function($scope, $interval, Order, Event) {

	var refreshOrders = function() {
		Order.readAll().then(function(orders) {
			orders.sort(function(order1, order2) {
				var priorityOrder = Order.getStatusPriority(order1.status) - Order.getStatusPriority(order2.status);
				
				if (priorityOrder == 0) {
					return order2.submitted - order1.submitted;
				}
				
				return priorityOrder;
			});		
			$scope.orders = orders;
		});
	};
	
	refreshOrders();
	
	var refreshEvents = function() {
		Event.readAll().then(function(events) {
			$scope.events = events;
		});
	}
	
	refreshEvents();
	
	$scope.order = null;
	$scope.orderFormShown = false;
	
	$scope.addOrder = function(offset) {
		$scope.orderFormShown = true;
		$scope.orderCopy = null;
		$scope.orderFormOffset = offset;		
	}
	
	$scope.onOrderSave = function(order) {
		$scope.orderFormShown = false;
		refreshOrders();
	}
	
	$scope.onOrderCancel = function() {
		$scope.orderFormShown = false;
	}
	
	$scope.editOrder = function(order, offset) {
		$scope.orderFormShown = true;
		$scope.orderCopy = angular.copy(order);
		
		$scope.orderFormOffset = offset;
	}
	
	var eventsPoll = $interval(refreshEvents, 2000);
	$scope.$on('$destroy', function() {
		$interval.$cancel(eventsPoll);
	});
}]);
