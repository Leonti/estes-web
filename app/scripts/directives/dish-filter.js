'use strict';

angular.module('estesWebApp').directive('dishFilter', function() {
	return {
		templateUrl: '/views/directives/dish-filter.html',
		replace: true,
		restrict: 'E',
		scope: {
			menus: '=',
			selectedMenus: '=',
			searchTerm: '='
		},
		link : function postLink(scope, element, attrs) {
		}
	};
});
