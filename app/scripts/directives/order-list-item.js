'use strict';

angular.module('estesWebApp').directive('orderListItem', ['Order', function(Order) {
	return {
		templateUrl : '/views/directives/order-list-item.html',
		restrict : 'E',
		scope : {
			order: '=',
			onEdit: '&'
		},
		link : function postLink(scope, element, attrs) {
		
			scope.inEdit = false;
			scope.orderCopy = null;
			
			scope.$watch('order', function(order) {
				scope.totalPrice = Order.calculateTotal(order);
			}, true);
			
			scope.onOrderClick = function(order) {
				scope.inEdit = true;
				scope.orderCopy = angular.copy(order);
			}
			
			scope.onOrderSave = function(order) {
				scope.inEdit = false;
			}
			
			scope.onOrderCancel = function() {
				scope.inEdit = false;
			}
		}
	};
}]);
