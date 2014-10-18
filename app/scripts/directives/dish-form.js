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
			
			$scope.$watch('inputDish', function(article) {
				if (!article) {
					return;
				}

				$scope.article = angular.copy(article);
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
				$scope.article.ingredients.push([ ingredient ]);
				$scope.hideAddIngredient();
			};

			$scope.orIngredientToDish = function(ingredient, index) {
				$scope.article.ingredients[index].push(ingredient);
				$scope.expandedRow = null;
			}

			$scope.removeIngredient = function(ingredientRow, ingredientCol) {
				if ($scope.article.ingredients[ingredientRow].length === 1) {
					$scope.article.ingredients.splice(ingredientRow, 1);
				} else {
					$scope.article.ingredients[ingredientRow].splice(ingredientCol, 1);
				}
			};

			$scope.orIngredientToDishCancel = function() {
				$scope.expandedRow = null;
			}

			$scope.save = function(article) {
				$scope.onSave({
					article : article
				});
			};

			$scope.cancel = function() {
				$scope.onClose();
			};

		}
	};
});
