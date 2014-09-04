'use strict';
/*global _:false */

angular.module('estesWebApp').factory('Order', ['$q', 'storage', 'Dish', function($q, storage, Dish) {
	
	var tax = 0.07;
	
	function calculatePrice(order) {
		var total = 0;
		_.each(order.dishes, function(dish) {
			total += Dish.getPrice(dish);
		});
		return total;
	}

	function calculateTax(order) {
		return calculatePrice(order) * tax;
	}
	
	function OrderMock($q, storage) {
		
		var mockIngredients = [
		            		   [{ id: 4, name: 'Regular fries', priceChange: 0 }, { id: 5, name: 'Curly fries', priceChange: 0.5 }],
		            		   [{ id: 2, name: 'Onions', priceChange: 0 }], 
		            		   [{ id: 1, name: 'Beef', priceChange: 0 }]
		            		];
		
		var selectedIngredients = [{ id: 5, name: 'Curly fries', priceChange: 0.5 }, { id: 2, name: 'Onions', priceChange: 0 }, { id: 1, name: 'Beef', priceChange: 0 }];
		
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
			var dishes = [];
			var titleBase = 'Burger';
			for (i = 0; i < getRandomInt(0, 8); i++) {
				var orderDish = {
						id: i,
						name: 'Dish ' + titleBase,
						price: 10,
						menus: ['Breakfast', 'Lunch'],
						ingredients: mockIngredients,
						selectedIngredients: selectedIngredients
					};
				
				if (status === 'PREPARED' || status === 'PAID') {
					orderDish.status = 'PREPARED';
				}
				
				dishes.push(orderDish);
			}
			
			return dishes;		
		};
		
		function getRandomInt(min, max) {
			  return Math.floor(Math.random() * (max - min)) + min;
		}
		
		var generateMockOrders = function() {
			var orders = [];
			
			for (var i = 0; i < 41; i++) {
				var status = getStatus(i);
				orders.push({
					id: i,
					waiter: {name: 'Krishti', id: 14},
					submitted: Date.now(),
					dishes: generateOrderDishes(i, status),
					status: status,
					note: 'Make it fast!'
				});
			}
			
			return orders;
		};
		
		var mockOrders = generateMockOrders();
		
		var statusPriorities = {
			'PREPARATION': 1,
			'PREPARED': 2,
			'PAID': 3
		};
		
		if (!storage.get('mockOrders')) {			
			storage.set('mockOrders', mockOrders);
		}
		
		return {
			readAll: function() {
				return $q.when(angular.copy(storage.get('mockOrders')));			
			},
			
			save: function(order) {
				var orders = storage.get('mockOrders');
				
				if (order.status === 'PREPARATION') {
					if (_.every(order.dishes, function(dish) { return dish.status === 'PREPARED'; })) {
						order.status = 'PREPARED';
					}
				}
				
				if (order.id === null || order.id === undefined) {
					order.id = orders.length;
					orders.push(order);				
				} else {
					for (var i = 0; i < orders.length; i++) {
						if (orders[i].id === order.id) {
							orders[i] = order;
						}
					}
				}

				storage.set('mockOrders', orders);
				return $q.when(order);
			},
			
			getStatusPriority: function(status) {
				return statusPriorities[status];
			},
			toOrderDish: function(dish) {
				return {
					name: dish.name,
					price: dish.price,
					ingredients: angular.copy(dish.ingredients),
					selectedIngredients: [],
					status: 'PREPARATION'
				};
			},
			calculatePrice: calculatePrice,
			calculateTax: calculateTax
		};
	}
	
	return new OrderMock($q, storage);
	
}]);
