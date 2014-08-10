'use strict';

angular.module('estesWebApp').service('Dish', function Dish() {

	
	var fakeMenus = ['Breakfast', 'Lunch', 'Dinner'];
	
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
				menus: menus
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
	
	return {
		readAll: function() {
			return generateFakeDishes();
		},
		readAllMenus: function() {
			return fakeMenus;
		}
	}
});
