'use strict';

angular.module('estesWebApp').directive('kitchenArticleListItem', function() {
	return {
		templateUrl: '/views/directives/kitchen-article-list-item.html',
		restrict : 'E',
		scope: {
			article: '=',
			done: '&'
		}
	};
});
