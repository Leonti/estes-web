'use strict';
/*global _:false */

angular.module('estesWebApp').factory('Dish', ['$q', 'storage', 'Demo', 'Rest', 'Restangular', function($q, storage, Demo, Rest, Restangular) {
	
	function getMenus(dishes) {
		return _.uniq(_.flatten(_.map(dishes, function(dish) { return dish.menus; })));
	}
	
	function getIngredients(dishes) {
		return _.uniq(_.flatten(_.map(dishes, function(dish) { return dish.ingredients; })), 
			function (ingredient) {
				return ingredient.name + ingredient.priceChange;
			});
	}
	
	function DishMock($q, storage) {
		
		var mockMenus = ['Breakfast', 'Lunch', 'Dinner'];
		
		var mockIngredients = [
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
				titleBase += '_' + menus[i];
			}
			for (i = 0; i < 10; i++) {
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
		};
		
		var getPrice = function(dish) {
			var price = dish.price;
			_.each(dish.selectedIngredients, function(ingredient) {
				price += ingredient.priceChange;
			});
			
			return price;
		};
		
		var saveDish = function(dish) {
			var dishes = storage.get('mockDishes');
			
			if (dish.id === undefined || dish.id === null) {
				dish.id = dishes.length + 1;
				dishes.push(dish);
			} else {
				for (var i = 0; i < dishes.length; i++) {
					if (dishes[i].id === dish.id) {
						dishes[i] = dish;
					}
				}
			}
			storage.set('mockDishes', dishes);
			return dish;
		};
		
		var removeDish = function(id) {
			var dishes = storage.get('mockDishes');
			for (var i = 0; i < dishes.length; i++) {
				if (dishes[i].id === id) {
					dishes.splice(i, 1);
				}
			}
			storage.set('mockDishes', dishes);
		};
		
		if (!storage.get('mockDishes')) {
			storage.set('mockDishes', generateFakeDishes());
			storage.set('mockMenus', mockMenus);
			storage.set('mockIngredients', mockIngredients);			
		}
		
		return {
			readAll: function() {
				return $q.when(angular.copy(storage.get('mockDishes')));
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
			getMenus: getMenus,
			getIngredients: getIngredients
		};
	}
	
	function Dish(Rest, Restangular) {
		
		return {
			
			readAll: function() {
				return Rest.configure().then(function() {
					return Restangular.all('dish').getList();	
				});
			},
			save: function(dish) {
				dish.selectedIngredients = [];
				dish.price = 1;
				return Rest.configure().then(function() {
					if (dish.id === undefined || dish.id === null) {
						return Restangular.one('dish').post('', dish);
					} else {
						return Restangular.one("dish", dish.id.id).customPUT(dish);
					}
				});
			},
			remove: function(id) {
				Restangular.getList('dish').then(function(dishes) {
					for (var i = 0; i < dishes.length; i++) {
						if (dishes[i].id === id) {
							dishes[i].remove();
						}
					}
				});
			},
			getPrice: function(dish) {
				return getPrice(dish);
			},
			getMenus: getMenus,
			getIngredients: getIngredients
		};		
	}

	if (Demo.isEnabled()) {
		return new DishMock($q, storage);
	} else {
		return new Dish(Rest, Restangular);
	}
	
}]);
