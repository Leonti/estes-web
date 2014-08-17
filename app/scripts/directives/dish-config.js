'use strict';

angular.module('estesWebApp').directive('dishConfig', function() {
	return {
		templateUrl: '/views/directives/dish-config.html',
		restrict: 'E',
		replace: true,
		scope: {
			dish: '=',
			onSave: '&',
			onCancel: '&'
		},
		link : function postLink(scope, element, attrs) {
			scope.selectedIngredients = [];
			
			scope.$watch('dish', function(dish) {
				if (!dish) return;

				_.each(dish.ingredients, function(ingredientsOr) {
					var ingredientStates = [];
					_.each(ingredientsOr, function(ingredient) {
						var initialState = ingredientStates.length ? false : true;
						ingredientStates.push(initialState);
					});					
					scope.selectedIngredients.push(ingredientStates);
				});
			});
			
			scope.$watch('selectedIngredients', function(selectedIngredients, oldSelectedIngredients) {
				if (!oldSelectedIngredients.length) return;
				
				for (var i = 0; i < selectedIngredients.length; i++) {
					
					var selectedOrs = selectedIngredients[i];
					var oldSelectedOrs = oldSelectedIngredients[i];
					var changedPosition = findChangedInRow(selectedOrs, oldSelectedOrs);
					if (changedPosition == -1) {
						continue;
					}
					
					for (var j = 0; j < selectedOrs.length; j++) {
						var ingredientState = selectedOrs[j];
						if (j != changedPosition) {
							selectedIngredients[i][j] = false;
						}
					}
				}
				
				function findChangedInRow(row, oldRow) {
					for (var i = 0; i < row.length; i++) {
						if (row[i] == true && oldRow[i] == false) {
							return i;
						}
					}
					return -1;
				}
				
			}, true);
			
			scope.save = function(dish) {
				scope.onSave({dish: dish});
			}
			
			scope.cancel = scope.onCancel;
		}
	};
});
