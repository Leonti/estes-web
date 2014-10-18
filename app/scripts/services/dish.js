'use strict';
/*global _:false */

angular.module('estesWebApp').factory('Dish', ['$q', 'storage', 'Demo', 'Rest', 'Restangular', function($q, storage, Demo, Rest, Restangular) {
	
	function getMenus(articles) {
		return _.uniq(_.flatten(_.map(articles, function(article) { return article.menus; })));
	}
	
	function getIngredients(articles) {
		return _.uniq(_.flatten(_.map(articles, function(article) { return article.ingredients; })), 
			function (ingredient) {
				return ingredient.name + ingredient.priceChange;
			});
	}
	
	function DishMock($q, storage) {
		
		var mockMenus = ['Breakfast', 'Lunch', 'Dinner'];
		
		var mockIngredients = [
		            		   { name: 'Regular fries', priceChange: '0' },
		            		   { name: 'Curly fries', priceChange: '0.5' }, 
		            		   { name: 'Onions', priceChange: '0' }, 
		            		   { name: 'Beef', priceChange: '0' }
		            		];
		
		var dishIngredients =  [
		            		   [{ name: 'Regular fries', priceChange: '0' }, { name: 'Curly fries', priceChange: '0.5' }],
		            		   [{ name: 'Onions', priceChange: '0' }], 
		            		   [{ name: 'Beef', priceChange: '0' }]
		            		];
		
		function generateDishesForMenus(menus, idBase) {
			var articles = [];
			var titleBase = '';
			for (var i = 0; i < menus.length; i++) {
				titleBase += '_' + menus[i];
			}
			for (i = 0; i < 10; i++) {
				articles.push({
					id: {userId: 1, id: idBase + i},
					name: 'Dish ' + titleBase + '_' + i,
					price: '10',
					menus: menus,
					ingredients: dishIngredients
				});
			}
			
			return articles;
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
		
		var saveDish = function(article) {
			var articles = storage.get('mockDishes');
			
			if (article.id === undefined || article.id === null) {
				article.id = {userId: 1, id: articles.length + 1};
				articles.push(article);
			} else {
				for (var i = 0; i < articles.length; i++) {
					if (articles[i].id.id === article.id.id) {
						articles[i] = article;
					}
				}
			}
			storage.set('mockDishes', articles);
			return article;
		};
		
		var removeDish = function(id) {
			var articles = storage.get('mockDishes');
			for (var i = 0; i < articles.length; i++) {
				if (articles[i].id.id === id.id) {
					articles.splice(i, 1);
				}
			}
			storage.set('mockDishes', articles);
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
			save: function(article) {
				return $q.when(saveDish(article));
			},
			remove: function(id) {
				return $q.when(removeDish(id));
			},
			getMenus: getMenus,
			getIngredients: getIngredients
		};
	}
	
	function Article(Rest, Restangular) {
		
		return {
			
			readAll: function() {
				return Rest.configure().then(function() {
					return Restangular.all('dish').getList();	
				});
			},
			save: function(article) {
				article.selectedIngredients = [];
				return Rest.configure().then(function() {
					if (article.id === undefined || article.id === null) {
						return Restangular.one('dish').post('', article);
					} else {
						return Restangular.one('dish', article.id.id).customPUT(article);
					}
				});
			},
			remove: function(id) {
				return Rest.configure().then(function() {
					return Restangular.all('dish').getList().then(function(articles) {
						for (var i = 0; i < articles.length; i++) {
							if (articles[i].id.id === id.id) {
								return Restangular.one('dish', id.id).customDELETE();
							}
						}
					});					
				});
			},
			getMenus: getMenus,
			getIngredients: getIngredients
		};		
	}

	if (Demo.isEnabled()) {
		return new DishMock($q, storage);
	} else {
		return new Article(Rest, Restangular);
	}
	
}]);
