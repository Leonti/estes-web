'use strict';

angular.module('estesWebApp').directive('orderFormPayment', ['Order', function(Order) {
	return {
		templateUrl : 'views/directives/order-form-payment.html',
		restrict : 'E',
		scope: {
			order: '='
		},
		link : function postLink(scope, element, attrs) {
			
			scope.calculateSubtotal = function(order) {
				if (!order) { return 0; }
				
				return Order.calculatePrice(order);
			};
			
			scope.calculateDiscount = function(order) {
				if (!order) { return 0; }
				
				return Order.calculateDiscount(order);
			} 
	
			scope.calculateTax = function(order) {
				if (!order) { return 0; }
				
				return Order.calculateTax(order);
			};
			
			scope.calculateTotal = function(order) {
				if (!order) { return 0; }
				
				return Order.calculateTotal(order);
			}
		}
	};
}]);
