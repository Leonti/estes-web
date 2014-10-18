'use strict';
/*global _:false */

angular.module('estesWebApp').directive('dishConfig', ['Order', function(Order) {
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
			scope.discount = 0;
			
			scope.$watch('inputDish', function(article) {
				if (!article) { return; }

				scope.article = angular.copy(article);
				scope.discount = Order.formatDiscount(article.discount);
				
				scope.selectedIngredients = [];
				for (var i = 0; i < article.ingredients.length; i++) {
					var ingredientOrs = article.ingredients[i];
					var ingredientStates = [];
					for (var j = 0; j < ingredientOrs.length; j++) {
						
						if (article.selectedIngredients[i]) {
							var state = ingredientOrs[j].name === article.selectedIngredients[i].name;
							ingredientStates.push(state);
						} else {
							ingredientStates.push(j == 0);							
						}
					}
					
					scope.selectedIngredients.push(ingredientStates);
				}
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
			
			scope.updateDiscount = function(discount) {
				scope.article.discount = Order.parseDiscount(discount);
			}
			
			scope.save = function(article) {
				
				article.selectedIngredients = [];
				
				for (var i = 0; i < scope.selectedIngredients.length; i++) {
					for (var j = 0; j < scope.selectedIngredients[i].length; j++) {
						if (scope.selectedIngredients[i][j]) {
							article.selectedIngredients.push(article.ingredients[i][j]);
						}
					}
				}
				
				// use 2-way binding to update the ui
				angular.extend(scope.inputDish, article);
				scope.onSave({article: article});
			};
			
			scope.cancel = scope.onCancel;
		}
	};
}]);
