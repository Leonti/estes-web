'use strict';

angular.module('estesWebApp').controller('KitchenCtrl', ['$scope', '$interval', 'Order', 
                                                 function($scope, $interval, Order) {
	
	var refreshOrders = function() {
		Order.readAll().then(function(orders) {
			orders.sort(function(order1, order2) {
				var priorityOrder = Order.getStatusPriority(order1.status) - Order.getStatusPriority(order2.status);
				
				if (priorityOrder == 0) {
					return order2.submitted - order1.submitted;
				}
				
				return priorityOrder;
			});		
			$scope.orders = orders;
		});
	};
	
	refreshOrders();
	
	$scope.articleDone = function(order, article) {
		article.status = 'PREPARED';
		Order.setArticlePrepared(order.id, article.id).then(function() {
			refreshOrders();			
		});
	};
	
	$scope.filterOrder = function(order) {
		var hasArticles = order.articles.length > 0;
		
		return hasArticles && order.status === 'PREPARATION';
	};
	
//	var ordersPoll = $interval(refreshOrders, 2000);
//	$scope.$on('$destroy', function() {
//		$interval.cancel(ordersPoll);
//	});
	
}]);
