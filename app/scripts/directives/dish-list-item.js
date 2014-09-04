'use strict';

angular.module('estesWebApp').directive('dishListItem', function() {
	return {
		templateUrl: '/views/directives/dish-list-item.html',
		restrict : 'E',
		scope: {
			dish: '='
		}
	};
});
