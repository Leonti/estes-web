'use strict';
/*global _,Big:false */

angular.module('estesWebApp').factory('Order', ['$q', 'storage', 'Article', 'Demo', 'Rest', 'Restangular', 
                                                function($q, storage, Article, Demo, Rest, Restangular) {
	
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
	
	function OrderMock($q, storage) {
		
		var mockOptions = [
		            		   [{ name: 'Regular fries', priceChange: '0' }, { name: 'Curly fries', priceChange: '0.5' }],
		            		   [{ name: 'Onions', priceChange: '0' }], 
		            		   [{ name: 'Beef', priceChange: '0' }]
		            		];
		
		var selectedOptions = [{ name: 'Curly fries', priceChange: '0.5' }, { name: 'Onions', priceChange: '0' }, { name: 'Beef', priceChange: '0' }];
		
		var getStatus = function(i) {

			if (i % 7 === 0) {
				return 'PREPARED';
			}		
			
			if (i % 5 === 0) {
				return 'PAID';
			}
			
			return 'PREPARATION';
		};
		
		var generateOrderArticles = function(i, status) {
			var articles = [];
			var titleBase = 'Burger';
			for (i = 0; i < getRandomInt(0, 8); i++) {
				var orderArticle = {
						id: generateId(),
						name: 'Article ' + titleBase,
						price: '10',
						tax: '7',
						discount: '0',
						tags: ['Breakfast', 'Lunch'],
						options: mockOptions,
						selectedOptions: selectedOptions,
						kitchen: true
					};
				
				if (status === 'PREPARED' || status === 'PAID') {
					orderArticle.status = 'PREPARED';
				}
				
				articles.push(orderArticle);
			}
			
			return articles;		
		};
		
		function generateMockEvent(orderId, articleId) {
			var events = storage.get('mockEvents');
			
			var event = {
				id: {userId: 1, id: events.length},
				timestamp: Date.now(),
				articlePrepared: {
					orderId: orderId,
					articleId: articleId
				}
			};
			events.push(event);
			
			storage.set('mockEvents', events);			
		}
		
		function getRandomInt(min, max) {
			  return Math.floor(Math.random() * (max - min)) + min;
		}
		
		var generateMockOrders = function() {
			var orders = [];
			
			for (var i = 0; i < 41; i++) {
				var status = getStatus(i);
				orders.push({
					id: {userId: 1, id: i},
					waiter: {name: 'Krishti', id: 14},
					submitted: Date.now(),
					articles: generateOrderArticles(i, status),
					discount: '0',
					status: status,
					note: 'Make it fast!'
				});
			}
			
			return orders;
		};
		
		var mockOrders = generateMockOrders();
		
		if (!storage.get('mockOrders')) {			
			storage.set('mockOrders', mockOrders);
		}
		
		return {
			readAll: function() {
				return $q.when(angular.copy(storage.get('mockOrders')));			
			},
			
			save: function(order) {
				var orders = storage.get('mockOrders');
				
				updateStatus(order);
				if (order.id === null || order.id === undefined) {
					order.submitted = Date.now();
					order.id = {userId: 1, id: orders.length};
					orders.push(order);				
				} else {
					for (var i = 0; i < orders.length; i++) {
						if (orders[i].id.id === order.id.id) {
							orders[i] = order;
						}
					}
				}

				storage.set('mockOrders', orders);
				return $q.when(order);
			},
			
			setArticlePrepared: function(orderId, articleId) {
				var orders = storage.get('mockOrders');

				var order = _.find(orders, function(order) {
					return order.id.id === orderId.id;
				});
				var orderArticle = _.find(order.articles, function(article) {
					return article.id === articleId;
				});
				orderArticle.status = 'PREPARED';
				updateStatus(orderArticle);
				
				generateMockEvent(orderId, articleId);
				
				storage.set('mockOrders', orders);
				return $q.when(order);				
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
	}
	
	function Order(Rest, Restangular) {
		
		return {
			
			readAll: function() {
				return Rest.configure().then(function() {
					return Restangular.all('order').getList();	
				});
			},
			save: function(order) {
				
				updateStatus(order);
				order.waiter = order.waiter.plain();
				order.note = order.note || '';
				return Rest.configure().then(function() {
					if (order.id === undefined || order.id === null) {
						order.submitted = Date.now();
						return Restangular.one('order').post('', order);
					} else {
						return Restangular.one('order', order.id.id).customPUT(order);
					}
				});
			},
			setArticlePrepared: function(orderId, articleId) {
				console.error('IMPLEMENT!');
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
	}
	
	if (Demo.isEnabled()) {
		return new OrderMock($q, storage);
	} else {
		return new Order(Rest, Restangular);
	}
	
}]);
