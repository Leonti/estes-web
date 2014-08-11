'use strict';

angular.module('estesWebApp').directive('dishForm', function (Dish) {
    return {
      templateUrl: 'views/dish-form.html',
      restrict: 'EA',
      scope: {
    	  inputDish: '=?dish',
    	  onClose: '&',
    	  onSave: '&'
      },
      link: function postLink($scope, element, attrs) {
		$scope.expandedRow = null;
		$scope.newIngredientNames = [];
		$scope.newIngredientPriceChanges = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		$scope.newIngredient = {
			name: null,
			priceChange: 0
		}
		
		Dish.readAllIngredients().then(function(ingredients) {
			$scope.typeaheadItems = ingredients; 
			$scope.filteredIngredients = angular.copy($scope.typeaheadItems);
		});
		
		Dish.readAllMenus().then(function(menus) {
			$scope.menus = menus;
		});
		$scope.selectedMenus = [];
		
		if (!$scope.inputDish) {
			$scope.dish = {
				name: '',
				price: 0,
				ingredients: [],
				menus: []
			}			
		} else {
			$scope.dish = angular.copy($scope.inputDish);
		}		
		
		
		var rowJustClosed = false;
		$scope.expandRow = function(row) {
			if (rowJustClosed) {
				rowJustClosed = false;
			} else {
				$scope.expandedRow = row;
			}
		}
		
		$scope.orIngredientToDish = function(row) {
			
			if ($scope.newIngredientNames[row]) {
				$scope.dish.ingredients[row].push({
					name: $scope.newIngredientNames[row],
					priceChange: $scope.newIngredientPriceChanges[row]
				});
			}
			
			resetNewIngredient();
		}
		
		$scope.orIngredientToDishCancel = resetNewIngredient;
		
		function resetNewIngredient() {
			$scope.newIngredientNames = [];
			$scope.newIngredientPriceChanges = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
			$scope.expandedRow = null;
			rowJustClosed = true;
		}
		
		$scope.addIngredientToDish = function() {
			
			if ($scope.newIngredient.name) {
				$scope.dish.ingredients.push([{
					name: $scope.newIngredient.name,
					priceChange: $scope.newIngredient.priceChange
				}]);
			}
			
			$scope.newIngredient = {
				name: null,
				priceChange: 0
			};
		}
		
		$scope.removeIngredient = function(ingredientRow, ingredientCol) {
			if ($scope.dish.ingredients[ingredientRow].length == 1) {
				$scope.dish.ingredients.splice(ingredientRow, 1);
			} else {
				$scope.dish.ingredients[ingredientRow].splice(ingredientCol, 1);			
			}
		}
		
		$scope.filterIngredients = function(ingredients, term) {
			$scope.filteredIngredients = filter(ingredients, term);
		}
		
		$scope.onTypeaheadSelect = function(ingredient) {
			$scope.newIngredient = angular.copy(ingredient);
		}
		
		$scope.onTypeaheadSelectOr = function(ingredient, row) {
			$scope.newIngredientNames[row] = ingredient.name;
			$scope.newIngredientPriceChanges[row] = ingredient.priceChange;
		}
		
		function filter(ingredients, term) {
			if (!term) return ingredients;
			return _.filter(ingredients, function(ingredient) { 
				return ingredient.name.toUpperCase().indexOf(term.toUpperCase()) == 0
			});
		}
		
		$scope.save = function(dish) {
			// use 2-way binding to update the ui
			angular.extend($scope.inputDish, $scope.dish);				
			$scope.onSave({dish: dish});
		}
		
		$scope.cancel = function() {
			$scope.onClose();
		}
      }
    };
  });