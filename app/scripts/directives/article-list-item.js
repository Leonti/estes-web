'use strict';

angular.module('estesWebApp').directive('articleListItem', function() {
	return {
		templateUrl: '/views/directives/article-list-item.html',
		restrict : 'E',
		scope: {
			article: '='
		}
	};
});
