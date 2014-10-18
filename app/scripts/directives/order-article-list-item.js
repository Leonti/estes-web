'use strict';

angular.module('estesWebApp').directive('orderArticleListItem', ['Order', function(Order) {
	return {
		templateUrl: '/views/directives/order-article-list-item.html',
		restrict : 'E',
		scope: {
			article: '='
		},
		link: function(scope) {
			
			scope.calculatePrice = Order.calculateArticlePrice;
			scope.formatDiscount = Order.formatDiscount;
			scope.calculateDiscount = Order.calculateArticleDiscount;
		}
	};
}]);
