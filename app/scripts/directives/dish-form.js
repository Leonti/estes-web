'use strict';
/* global _:false */

angular.module('estesWebApp').directive('dishForm', function() {
	return {
		templateUrl : 'views/directives/dish-form.html',
		restrict : 'EA',
		scope : {
			inputDish : '=?dish',
			menus : '=',
			ingredients : '=',
			onClose : '&',
			onSave : '&'
		},
		link : function postLink($scope) {

			$scope.expandedRow = null;
			$scope.addingIngredient = false;
			
			$scope.$watch('inputDish', function(dish) {
				if (!dish) {
					return;
				}

				$scope.dish = angular.copy(dish);
			});

			$scope.expandRow = function(row) {
				$scope.expandedRow = row;
			};
			
			$scope.showAddIngredient = function() {
				$scope.addingIngredient = true;
			};

			$scope.hideAddIngredient = function() {
				$scope.addingIngredient = false;
			};			
			
			$scope.addIngredientToDish = function(ingredient) {
				$scope.dish.ingredients.push([ ingredient ]);
				$scope.hideAddIngredient();
			};

			$scope.orIngredientToDish = function(ingredient, index) {
				$scope.dish.ingredients[index].push(ingredient);
				$scope.expandedRow = null;
			}

			$scope.removeIngredient = function(ingredientRow, ingredientCol) {
				if ($scope.dish.ingredients[ingredientRow].length === 1) {
					$scope.dish.ingredients.splice(ingredientRow, 1);
				} else {
					$scope.dish.ingredients[ingredientRow].splice(ingredientCol, 1);
				}
			};

			$scope.orIngredientToDishCancel = function() {
				$scope.expandedRow = null;
			}

			$scope.save = function(dish) {
				$scope.onSave({
					dish : dish
				});
			};

			$scope.cancel = function() {
				$scope.onClose();
			};

		}
	};
});
