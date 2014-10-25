'use strict';

angular.module('estesWebApp').directive('orderArticleListItem', ['Order', function(Order) {
	return {
		templateUrl: '/views/directives/order-article-list-item.html',
		restrict : 'E',
		scope: {
			article: '='
		},
		link: function(scope) {
			
			scope.$watch('article', function(article) {
				scope.discountValue = Order.calculateArticleDiscount(article);
				scope.price = Order.calculateArticlePrice(article);
			}, true);
		}
	};
}]);
