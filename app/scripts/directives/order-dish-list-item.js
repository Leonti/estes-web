'use strict';

angular.module('estesWebApp').directive('orderDishListItem', function() {
	return {
		templateUrl: '/views/directives/order-dish-list-item.html',
		restrict : 'E',
		scope: {
			dish: '='
		},
		link : function postLink(scope, element, attrs) {}
	};
});
