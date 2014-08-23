'use strict';

angular.module('estesWebApp').directive('kitchenDishListItem', function() {
	return {
		templateUrl: '/views/directives/kitchen-dish-list-item.html',
		restrict : 'E',
		scope: {
			dish: '='
		},
		link : function postLink(scope, element, attrs) {}
	};
});
