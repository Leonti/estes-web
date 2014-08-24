'use strict';

angular.module('estesWebApp').factory('Dish', ['$q', 'storage', function($q, storage) {
	
	return new DishMock($q, storage);
	
	function DishMock($q, storage) {
		
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
		
		function generateDishesForMenus(menus, idBase) {
			var dishes = [];
			var titleBase = '';
			for (var i = 0; i < menus.length; i++) {
				titleBase += '_' + menus[i]
			}
			for (var i = 0; i < 10; i++) {
				dishes.push({
					id: idBase + i,
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
			allDishes = allDishes.concat(generateDishesForMenus(['Breakfast'], allDishes.length));
			allDishes = allDishes.concat(generateDishesForMenus(['Lunch'], allDishes.length));
			allDishes = allDishes.concat(generateDishesForMenus(['Dinner'], allDishes.length));
			allDishes = allDishes.concat(generateDishesForMenus(['Dinner', 'Breakfast'], allDishes.length));
			allDishes = allDishes.concat(generateDishesForMenus(['Dinner', 'Lunch'], allDishes.length));
			allDishes = allDishes.concat(generateDishesForMenus(['Breakfast', 'Lunch', 'Dinner'], allDishes.length));
			return allDishes;
		}
		
		var getPrice = function(dish) {
			var price = dish.price;
			_.each(dish.selectedIngredients, function(ingredient) {
				price += ingredient.priceChange;
			});
			
			return price;
		}
		
		var saveDish = function(dish) {
			var dishes = storage.get('fakeDishes');
			if (dish.id !== undefined || dish.id !== null) {
				for (var i = 0; i < dishes.length; i++) {
					if (dishes[i].id === dish.id) {
						dishes[i] = dish;
					}
				}
			} else {
				dish.id = dishes.length + 1;
				dishes.push(dish);
			}
			storage.set('fakeDishes', dishes);
			return dish;
		}
		
		var removeDish = function(id) {
			var dishes = storage.get('fakeDishes');
			for (var i = 0; i < dishes.length; i++) {
				if (dishes[i].id === id) {
					dishes.splice(i, 1);
				}
			}
			storage.set('fakeDishes', dishes);
		}
		
		storage.set('fakeDishes', generateFakeDishes());
		storage.set('fakeMenus', fakeMenus);
		storage.set('fakeIngredients', fakeIngredients);
		
		return {
			readAll: function() {
				return $q.when(storage.get('fakeDishes'));
			},
			readAllMenus: function() {
				return $q.when(storage.get('fakeMenus'));
			},
			readAllIngredients: function() {
				return $q.when(storage.get('fakeIngredients'));			
			},
			save: function(dish) {
				return $q.when(saveDish(dish));
			},
			remove: function(id) {
				return $q.when(removeDish(id));
			},
			getPrice: function(dish) {
				return getPrice(dish);
			},
			toOrderDish: function(dish) {
				return {
					name: dish.name,
					price: dish.price,
					ingredients: angular.copy(dish.ingredients),
					selectedIngredients: [],
					status: 'SUBMITTED'
				}
			}
		}
	}	
	
}]);
