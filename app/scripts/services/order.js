'use strict';

angular.module('estesWebApp').factory('Order', ['$q', 'storage', function($q, storage) {
	
	return new OrderMock($q, storage);
	
	function OrderMock($q, storage) {
		
		var mockIngredients = [
		            		   [{ id: 4, name: 'Regular fries', priceChange: 0 }, { id: 5, name: 'Curly fries', priceChange: 0.5 }],
		            		   [{ id: 2, name: 'Onions', priceChange: 0 }], 
		            		   [{ id: 1, name: 'Beef', priceChange: 0 }]
		            		];
		
		var selectedIngredients = [{ id: 5, name: 'Curly fries', priceChange: 0.5 }, { id: 2, name: 'Onions', priceChange: 0 }, { id: 1, name: 'Beef', priceChange: 0 }];
		
		var getStatus = function(i) {

			if (i % 7 == 0) {
				return 'PREPARED';
			}		
			
			if (i % 6 == 0) {
				return 'PAID';
			}		
			
			if (i % 5 == 0) {
				return 'SERVED';
			}		
			
			if (i % 4 == 0) {
				return 'COMPLETED';
			}
			
			if (i % 3 == 0) {
				return 'SUBMITTED';
			}
			if (i % 2 == 0) {
				return 'PREPARATION';
			}
			
			return 'PREPARATION';
		}
		
		var generateOrderDishes = function(i) {
			var dishes = [];
			var titleBase = 'Burger';
			for (var i = 0; i < getRandomInt(0, 8); i++) {
				dishes.push({
					name: 'Dish ' + titleBase,
					price: 10,
					menus: ['Breakfast', 'Lunch'],
					ingredients: mockIngredients,
					selectedIngredients: selectedIngredients
				});
			}
			
			return dishes;		
		}
		
		function getRandomInt(min, max) {
			  return Math.floor(Math.random() * (max - min)) + min;
		}
		
		var generateMockOrders = function() {
			var orders = [];
			
			for (var i = 0; i < 41; i++) {
				orders.push({
					id: i,
					waiter: {name: 'Krishti', id: 14},
					submitted: Date.now(),
					dishes: generateOrderDishes(i),
					status: getStatus(i),
					note: 'Make it fast!'
				});
			}
			
			return orders;
		}
		
		var mockOrders = generateMockOrders();
		
		var statuses = ['SUBMITTED', 'PREPARATION', 'PREPARED', 'SERVED', 'COMPLETED', 'PAID'];
		
		var statusPriorities = {
			'SUBMITTED': 0,
			'PREPARATION': 1,
			'PREPARED': 2,
			'SERVED': 3,
			'COMPLETED': 4,
			'PAID': 5
		};
		
		if (!storage.get('mockOrders')) {			
			storage.set('mockOrders', mockOrders);
		}
		
		return {
			readAll: function() {
				return $q.when(storage.get('mockOrders'));			
			},
			
			save: function(order) {
				var orders = storage.get('mockOrders');
				
				if (!order.id) {
					order.id = orders.length;
					orders.push(order);				
				} else {
					for (var i = 0; i < orders.length; i++) {
						if (orders[i].id == order.id) {
							orders[i] = order;
						}
					}
				}

				storage.set('mockOrders', orders);
				return $q.when(order);
			},
			
			getStatusList: function() {
				return $q.when(statuses);				
			},
			
			getStatusPriority: function(status) {
				return statusPriorities[status];
			}
		}
	}
	
}]);
