'use strict';
/*global _,Big:false */

angular.module('estesWebApp').factory('Order', ['Article', 'Rest', 'Restangular', function(Article, Rest, Restangular) {
	
	function calculateArticlePriceNoRound(article) {
		var price = new Big(article.price);
		_.each(article.selectedOptions, function(option) {
			price = price.plus(new Big(option.priceChange));
		});
		
		return price;		
	}
	
	function calculateArticleDiscountNoRound(article) {
		return calculateArticlePriceNoRound(article).times(new Big(article.discount).div(new Big(100)));
	}
	
	function calculateOrderPriceNoRound(order) {
		var total = new Big(0);
		_.each(order.articles, function(article) {
			total = total.plus(calculateArticlePriceNoRound(article).minus(calculateArticleDiscountNoRound(article)));
		});
		
		return total;
	}
	
	function calculateOrderDiscountNoRound(order) {
		return calculateOrderPriceNoRound(order).times(new Big(order.discount).div(new Big(100)));
	}
	
	function calculateTaxNoRound(order) {
		var total = new Big(0);
		_.each(order.articles, function(article) {
			var articlePrice = calculateArticlePriceNoRound(article).minus(calculateArticleDiscountNoRound(article));
			var discountedArticlePrice = articlePrice.minus(articlePrice.times(new Big(order.discount).div(new Big(100))));
			
			total = total.plus(discountedArticlePrice.times(new Big(article.tax).div(new Big(100))));
		});
		
		return total;
	}	
	
	function calculateArticlePrice(article) {
		return calculateArticlePriceNoRound(article).toFixed(2).toString();
	}
	
	function calculateArticleDiscount(article) {
		return calculateArticleDiscountNoRound(article).toFixed(2).toString();
	}
	
	function calculateOrderPrice(order) {
		return calculateOrderPriceNoRound(order).toFixed(2).toString();
	}
	
	function calculateOrderDiscount(order) {
		return calculateOrderDiscountNoRound(order).toFixed(2).toString();
	}
	
	function calculateTax(order) {
		return calculateTaxNoRound(order).toFixed(2).toString();
	}
	
	function calculateTotal(order) {
		return calculateOrderPriceNoRound(order).minus(calculateOrderDiscountNoRound(order)).plus(calculateTaxNoRound(order)).toFixed(2).toString();		
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
		
		readSince: function(since) {
			throw 'Implement';
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
		calculateArticlePrice: calculateArticlePrice,
		calculateArticleDiscount: calculateArticleDiscount,
		calculatePrice: calculateOrderPrice,
		calculateDiscount: calculateOrderDiscount,
		calculateTax: calculateTax,
		calculateTotal: calculateTotal
	};		
	
}]);
