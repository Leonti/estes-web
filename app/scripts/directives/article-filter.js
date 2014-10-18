'use strict';

angular.module('estesWebApp').directive('articleFilter', function() {
	return {
		templateUrl: '/views/directives/article-filter.html',
		replace: true,
		restrict: 'E',
		scope: {
			tags: '=',
			selectedTags: '=',
			searchTerm: '='
		}
	};
});
