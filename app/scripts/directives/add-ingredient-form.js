'use strict';

angular.module('estesWebApp').directive('addIngredientForm', [function() {
	
	var IngredientTemplate = function() {
		return {
			name: '',
			priceChange: '0'
		}
	};
	
	return {
		templateUrl: '/views/directives/add-ingredient-form.html',
		restrict: 'E',
		scope: {
			ingredients: '=',
			onClose: '&',
			onSave: '&'
		},
		link: function postLink(scope, element, attrs) {
			
			scope.ingredient = new IngredientTemplate();
			
			scope.$watch('ingredients', function(ingredients) {
				if (!ingredients) { return; }
				
				scope.typeaheadItems = ingredients;
				scope.filteredIngredients = angular.copy(scope.typeaheadItems);
			});
			
			scope.onTypeaheadSelect = function(ingredient) {
				scope.ingredient = angular.copy(ingredient);
			};
			
			scope.filterIngredients = function(ingredients, term) {
				scope.filteredIngredients = filter(ingredients, term);
			};
			
			function filter(ingredients, term) {
				if (!term) { return ingredients; }
				return _.filter(ingredients, function(ingredient) { 
					return ingredient.name.toUpperCase().indexOf(term.toUpperCase()) === 0;
				});
			}			
			
			scope.save = function(ingredient) {
				scope.onSave({ingredient: ingredient});
				scope.ingredient = new IngredientTemplate();
			}
			
			scope.cancel = function() {
				scope.onClose();
				scope.ingredient = new IngredientTemplate();
			}
		}
	};
}]);
