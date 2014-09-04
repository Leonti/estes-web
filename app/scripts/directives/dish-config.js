'use strict';
/*global _:false */

angular.module('estesWebApp').directive('dishConfig', function() {
	return {
		templateUrl: '/views/directives/dish-config.html',
		restrict: 'E',
		replace: true,
		scope: {
			inputDish: '=dish',
			onSave: '&',
			onCancel: '&'
		},
		link : function postLink(scope) {
			scope.selectedIngredients = [];
			
			scope.$watch('inputDish', function(dish) {
				if (!dish) { return; }

				scope.dish = angular.copy(dish);
				
				scope.selectedIngredients = [];
				_.each(dish.ingredients, function(ingredientsOr) {
					var ingredientStates = [];
					_.each(ingredientsOr, function() {
						var initialState = ingredientStates.length ? false : true;
						ingredientStates.push(initialState);
					});					
					scope.selectedIngredients.push(ingredientStates);
				});
			});
			
			scope.$watch('selectedIngredients', function(selectedIngredients, oldSelectedIngredients) {
				if (!oldSelectedIngredients.length) { return; }
				
				function findChangedInRow(row, oldRow) {
					if (!oldRow) { return -1; }
					
					for (var i = 0; i < row.length; i++) {
						if (row[i] === true && oldRow[i] === false) {
							return i;
						}
					}
					return -1;
				}
				
				for (var i = 0; i < selectedIngredients.length; i++) {
					
					var selectedOrs = selectedIngredients[i];
					var oldSelectedOrs = oldSelectedIngredients[i];
					var changedPosition = findChangedInRow(selectedOrs, oldSelectedOrs);
					if (changedPosition === -1) {
						continue;
					}
					
					for (var j = 0; j < selectedOrs.length; j++) {
						if (j !== changedPosition) {
							selectedIngredients[i][j] = false;
						}
					}
				}
				
			}, true);
			
			scope.save = function(dish) {
				
				dish.selectedIngredients = [];
				
				for (var i = 0; i < scope.selectedIngredients.length; i++) {
					for (var j = 0; j < scope.selectedIngredients[i].length; j++) {
						if (scope.selectedIngredients[i][j]) {
							dish.selectedIngredients.push(dish.ingredients[i][j]);
						}
					}
				}
				
				// use 2-way binding to update the ui
				angular.extend(scope.inputDish, dish);
				scope.onSave({dish: dish});
			};
			
			scope.cancel = scope.onCancel;
		}
	};
});
