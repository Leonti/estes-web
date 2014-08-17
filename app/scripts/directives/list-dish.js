'use strict';

angular.module('estesWebApp').directive('listDish', function() {
	return {
		templateUrl: '/views/directives/list-dish.html',
		restrict : 'E',
		scope: {
			dish: '='
		},
		link : function postLink(scope, element, attrs) {
		}
	};
});
