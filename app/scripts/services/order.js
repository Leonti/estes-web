'use strict';
/*global _,Big:false */

angular.module('estesWebApp').factory('Order', ['$q', 'storage', 'Dish', 'Demo', 'Rest', 'Restangular', 
                                                function($q, storage, Article, Demo, Rest, Restangular) {
	
	function calculateDishPriceNoRound(article) {
		var price = new Big(article.price);
		_.each(article.selectedIngredients, function(ingredient) {
			price = price.plus(new Big(ingredient.priceChange));
		});
		
		return price;		
	}
	
	function calculateDishDiscountNoRound(article) {
		return calculateDishPriceNoRound(article).times(new Big(article.discount));
	}
	
	function calculateOrderPriceNoRound(order) {
		var total = new Big(0);
		_.each(order.articles, function(article) {
			total = total.plus(calculateDishPriceNoRound(article).minus(calculateDishDiscountNoRound(article)));
		});
		
		return total;
	}
	
	function calculateOrderDiscountNoRound(order) {
		return calculateOrderPriceNoRound(order).times(new Big(order.discount));
	}
	
	function calculateTaxNoRound(order) {
		var total = new Big(0);
		_.each(order.articles, function(article) {
			var dishPrice = calculateDishPriceNoRound(article).minus(calculateDishDiscountNoRound(article));
			var discountedDishPrice = dishPrice.minus(dishPrice.times(new Big(order.discount)));
			
			total = total.plus(discountedDishPrice.times(new Big(article.tax)));
		});
		
		return total;
	}	
	
	function calculateDishPrice(article) {
		return calculateDishPriceNoRound(article).toFixed(2).toString();
	}
	
	function calculateDishDiscount(article) {
		return calculateDishDiscountNoRound(article).toFixed(2).toString();
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
	
	function formatDiscount(discount) {
		return new Big(discount).times(new Big(100)).toString();
	}
	
	function parseDiscount(discount) {
		return new Big(discount).div(new Big(100)).toString();
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
	
	function toOrderDish(article, tax) {
		return {
			name: article.name,
			price: article.price,
			tax: tax,
			discount: '0',
			ingredients: angular.copy(article.ingredients),
			selectedIngredients: [],
			status: 'PREPARATION'
		};
	}
	
	function getStatusPriority(status) {
		return statusPriorities[status];
	}	
	
	function OrderMock($q, storage) {
		
		var mockIngredients = [
		            		   [{ name: 'Regular fries', priceChange: '0' }, { name: 'Curly fries', priceChange: '0.5' }],
		            		   [{ name: 'Onions', priceChange: '0' }], 
		            		   [{ name: 'Beef', priceChange: '0' }]
		            		];
		
		var selectedIngredients = [{ name: 'Curly fries', priceChange: '0.5' }, { name: 'Onions', priceChange: '0' }, { name: 'Beef', priceChange: '0' }];
		
		var getStatus = function(i) {

			if (i % 7 === 0) {
				return 'PREPARED';
			}		
			
			if (i % 5 === 0) {
				return 'PAID';
			}
			
			return 'PREPARATION';
		};
		
		var generateOrderDishes = function(i, status) {
			var articles = [];
			var titleBase = 'Burger';
			for (i = 0; i < getRandomInt(0, 8); i++) {
				var orderArticle = {
						name: 'Dish ' + titleBase,
						price: '10',
						tax: '0.07',
						discount: '0',
						menus: ['Breakfast', 'Lunch'],
						ingredients: mockIngredients,
						selectedIngredients: selectedIngredients
					};
				
				if (status === 'PREPARED' || status === 'PAID') {
					orderArticle.status = 'PREPARED';
				}
				
				articles.push(orderArticle);
			}
			
			return articles;		
		};
		
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
					articles: generateOrderDishes(i, status),
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
			
			getStatusPriority: getStatusPriority,
			toOrderDish: toOrderDish,
			calculateDishPrice: calculateDishPrice,
			calculateDishDiscount: calculateDishDiscount,
			calculatePrice: calculateOrderPrice,
			calculateDiscount: calculateOrderDiscount,
			calculateTax: calculateTax,
			calculateTotal: calculateTotal,
			formatDiscount: formatDiscount,
			parseDiscount: parseDiscount
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
			
			getStatusPriority: getStatusPriority,
			toOrderDish: toOrderDish,
			calculateDishPrice: calculateDishPrice,
			calculateDishDiscount: calculateDishDiscount,
			calculatePrice: calculateOrderPrice,
			calculateDiscount: calculateOrderDiscount,
			calculateTax: calculateTax,
			calculateTotal: calculateTotal,
			formatDiscount: formatDiscount,
			parseDiscount: parseDiscount			
		};		
	}
	
	if (Demo.isEnabled()) {
		return new OrderMock($q, storage);
	} else {
		return new Order(Rest, Restangular);
	}
	
}]);
