'use strict';

angular.module('estesWebApp').directive('kitchenDishListItem', function() {
	return {
		templateUrl: '/views/directives/kitchen-dish-list-item.html',
		restrict : 'E',
		scope: {
			dish: '=',
			done: '&'
		},
		link : function postLink(scope, element, attrs) {}
	};
});
