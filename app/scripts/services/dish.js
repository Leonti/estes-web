'use strict';

angular.module('estesWebApp').service('Dish', function Dish($q) {
	
	var fakeMenus = ['Breakfast', 'Lunch', 'Dinner'];
	
	var fakeIngredients = [
	            		   { id: 4, name: 'Regular fries', priceChange: 0 },
	            		   { id: 5, name: 'Curly fries', priceChange: 0.5 }, 
	            		   { id: 2, name: 'Onions', priceChange: 0 }, 
	            		   { id: 1, name: 'Beef', priceChange: 0 }
	            		];
	
	var dishIngredients =  [
	            		   [{ id: 4, name: 'Regular fries', priceChange: 0 }, { id: 5, name: 'Curly fries', priceChange: 0.5 }],
	            		   [{ id: 2, name: 'Onions', priceChange: 0 }], 
	            		   [{ id: 1, name: 'Beef', priceChange: 0 }]
	            		];
	
	function generateDishesForMenus(menus) {
		var dishes = [];
		var titleBase = '';
		for (var i = 0; i < menus.length; i++) {
			titleBase += '_' + menus[i]
		}
		for (var i = 0; i < 10; i++) {
			dishes.push({
				name: 'Dish ' + titleBase + '_' + i,
				price: 10,
				menus: menus,
				ingredients: dishIngredients
			});
		}
		
		return dishes;
	}
	
	var generateFakeDishes = function() {
		var allDishes = [];
		allDishes = allDishes.concat(generateDishesForMenus(['Breakfast']));
		allDishes = allDishes.concat(generateDishesForMenus(['Lunch']));
		allDishes = allDishes.concat(generateDishesForMenus(['Dinner']));
		allDishes = allDishes.concat(generateDishesForMenus(['Dinner', 'Breakfast']));
		allDishes = allDishes.concat(generateDishesForMenus(['Dinner', 'Lunch']));
		allDishes = allDishes.concat(generateDishesForMenus(['Breakfast', 'Lunch', 'Dinner']));
		return allDishes;
	}
	
	var getPrice = function(dish) {
		var price = dish.price;
		_.each(dish.ingredients, function(ingredientOrs) {
			price += ingredientOrs[0].priceChange;
		});
		
		return price;
	}
	
	return {
		readAll: function() {
			var deferred = $q.defer();
			deferred.resolve(generateFakeDishes());
			return deferred.promise;			
		},
		readAllMenus: function() {
			var deferred = $q.defer();
			deferred.resolve(fakeMenus);
			return deferred.promise;
		},
		readAllIngredients: function() {
			var deferred = $q.defer();
			deferred.resolve(fakeIngredients);
			return deferred.promise;			
		},
		save: function(dish) {
			console.log('saving dish');
			console.log(dish);
		},
		getPrice: function(dish) {
			return getPrice(dish);
		}
	}
});
