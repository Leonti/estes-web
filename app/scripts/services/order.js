'use strict';

angular.module('estesWebApp').service('Order', function Order($q) {
	
	var fakeIngredients = [
	            		   { id: 4, name: 'Regular fries', priceChange: 0 },
	            		   { id: 5, name: 'Curly fries', priceChange: 0.5 }, 
	            		   { id: 2, name: 'Onions', priceChange: 0 }, 
	            		   { id: 1, name: 'Beef', priceChange: 0 }
	            		];
	
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
				ingredients: fakeIngredients
			});
		}
		
		return dishes;		
	}
	
	function getRandomInt(min, max) {
		  return Math.floor(Math.random() * (max - min)) + min;
	}
	
	var generateFakeOrders = function() {
		var orders = [];
		
		for (var i = 0; i < 40; i++) {
			orders.push({
				waiter: {
					name: 'Leonti'
				},
				submitted: Date.now(),
				dishes: generateOrderDishes(i),
				status: getStatus(i)
			});
		}
		
		return orders;
	}
	
	var statusPriorities = {
		'SUBMITTED': 0,
		'PREPARATION': 1,
		'PREPARED': 2,
		'SERVED': 3,
		'COMPLETED': 4,
		'PAID': 5
	};
	
	return {
		readAll: function() {
			var deferred = $q.defer();
			deferred.resolve(generateFakeOrders());
			return deferred.promise;			
		},
		
		getStatusPriority: function(status) {
			return statusPriorities[status];
		}
	}
});
