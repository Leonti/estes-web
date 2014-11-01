'use strict';
/*global _,Big:false */

angular.module('estesWebApp').factory('Order', ['Article', 'Rest', 'Restangular', function(Article, Rest, Restangular) {
	
	function calculateArticlePrice(article) {
		var price = new Big(article.price);
		_.each(article.selectedOptions, function(option) {
			price = price.plus(new Big(option.priceChange));
		});
		
		return price;		
	}
	
	function calculateArticleDiscount(article) {
		return calculateArticlePrice(article).times(new Big(article.discount).div(new Big(100)));
	}
	
	function calculateOrderPrice(order) {
		var total = new Big(0);
		_.each(order.articles, function(article) {
			total = total.plus(calculateArticlePrice(article).minus(calculateArticleDiscount(article)));
		});
		
		return total;
	}
	
	function calculateOrderDiscount(order) {
		return calculateOrderPrice(order).times(new Big(order.discount).div(new Big(100)));
	}
	
	function calculateTax(order) {
		var total = new Big(0);
		_.each(order.articles, function(article) {
			var articlePrice = calculateArticlePrice(article).minus(calculateArticleDiscount(article));
			var discountedArticlePrice = articlePrice.minus(articlePrice.times(new Big(order.discount).div(new Big(100))));
			
			total = total.plus(discountedArticlePrice.times(new Big(article.tax).div(new Big(100))));
		});
		
		return total;
	}	
	
	function calculateTotal(order) {
		return calculateOrderPrice(order).minus(calculateOrderDiscount(order)).plus(calculateTax(order));	
	}
	
	function calculateDiscountOrderList(orders) {
		var total = new Big(0);
		_.each(orders, function(order) {
			total = total.plus(calculateOrderDiscount(order));
		});
		return total;		
	}
	
	function calculatePriceOrderList(orders) {
		var total = new Big(0);
		_.each(orders, function(order) {
			total = total.plus(calculateOrderPrice(order));
		});
		return total;
	}
	
	function calculateTaxOrderList(orders) {
		var total = new Big(0);
		_.each(orders, function(order) {
			total = total.plus(calculateTax(order));
		});
		return total;		
	}
	
	function calculateTotalOrderList(orders) {
		return calculatePriceOrderList(orders).minus(calculateDiscountOrderList(orders)).plus(calculateTaxOrderList(orders));			
	}
	
	var statusPriorities = {
			'PREPARATION': 1,
			'PREPARED': 2,
			'PAID': 3
	};
	
	function updateStatus(order) {
		if (order.status === 'PREPARATION') {
			if (_.every(order.articles, function(article) { return article.status === 'PREPARED'; })) {
				order.status = 'PREPARED';
			}
		}
	}
	
	function generateId() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		    return v.toString(16);
		});
	}	
	
	function toOrderArticle(article) {
		return {
			id: generateId(),
			name: article.name,
			price: article.price,
			tax: article.taxGroup.tax,
			discount: '0',
			options: angular.copy(article.options),
			selectedOptions: [],
			status: article.kitchen ? 'PREPARATION' : 'PREPARED',
			kitchen: article.kitchen
		};
	}
	
	function getStatusPriority(status) {
		return statusPriorities[status];
	}
	
	return {
		
		readAll: function() {
			return Rest.configure().then(function() {
				return Restangular.all('order').getList();	
			});
		},
		
		read: function(orderId) {
			return Rest.configure().then(function() {
				return Restangular.one('order', orderId.id).get();	
			});			
		},
		
		readInRange: function(from, to) {
			return Rest.configure().then(function() {
				return Restangular.all('order/from/' + from + '/to/' + to).getList();	
			});
		},
		
		save: function(order) {
			
			updateStatus(order);
			order.waiter = order.waiter.plain();
			order.note = order.note || '';
			return Rest.configure().then(function() {
				if (order.id === undefined || order.id === null) {
					return Restangular.one('order').post('', order);
				} else {
					return Restangular.one('order', order.id.id).customPUT(order);
				}
			});
		},
		setArticlePrepared: function(orderId, articleId) {
			return Rest.configure().then(function() {
				return Restangular.one('order', orderId.id).one('article', articleId).customOperation('patch', '', {}, {},
					{ 'op': 'replace', 'path': '/status', 'value': 'PREPARED' }		
				);
			});
		},
		
		getStatusPriority: getStatusPriority,
		toOrderArticle: toOrderArticle,
		calculateArticlePrice: function(article) {
			return calculateArticlePrice(article).toFixed(2).toString();
		},
		calculateArticleDiscount: function(article) {
			return calculateArticleDiscount(article).toFixed(2).toString();
		},
		calculateDiscount: function(order) {
			return calculateOrderDiscount(order).toFixed(2).toString();
		},
		calculatePrice: function(order) {
			return calculateOrderPrice(order).toFixed(2).toString();
		},
		calculateTax: function(order) {
			return calculateTax(order).toFixed(2).toString();
		},
		calculateTotal: function(order) {
			return calculateTotal(order).toFixed(2).toString();
		},
		calculateDiscountForList: function(orders) {
			return calculateDiscountOrderList(orders).toFixed(2).toString();
		},
		calculatePriceForList: function(orders) {
			return calculatePriceOrderList(orders).toFixed(2).toString();
		},
		calculateTaxForList: function(orders) {
			return calculateTaxOrderList(orders).toFixed(2).toString();
		},
		calculateTotalForList: function(orders) {
			return calculateTotalOrderList(orders).toFixed(2).toString();
		}		
	};		
	
}]);
