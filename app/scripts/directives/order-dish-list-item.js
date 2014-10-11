'use strict';

angular.module('estesWebApp').directive('orderDishListItem', ['Order', function(Order) {
	return {
		templateUrl: '/views/directives/order-dish-list-item.html',
		restrict : 'E',
		scope: {
			dish: '='
		},
		link: function(scope) {
			
			scope.calculatePrice = Order.calculateDishPrice;
			scope.formatDiscount = Order.formatDiscount;
			scope.calculateDiscount = Order.calculateDishDiscount;
		}
	};
}]);
