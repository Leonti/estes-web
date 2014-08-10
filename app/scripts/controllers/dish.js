'use strict';

angular.module('estesWebApp').controller('DishCtrl', function ($scope, Dish) {
    
	$scope.expandedRow = null;
	$scope.newIngredientNames = [];
	$scope.newIngredientPriceChanges = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	$scope.newIngredient = {
		name: null,
		priceChange: 0
	}
	
	$scope.menus = Dish.readAllMenus();
	$scope.selectedMenus = [];
	
	$scope.dish = {
		id: 1,
		name: 'Meat Burger',
		price: 10,
		ingredients: [
		    [{ id: 1, name: 'Beef', priceChange: 0 }],
		    [{ id: 2, name: 'Onions', priceChange: 0 }],
		    [{ id: 3, name: 'Tomatoes', priceChange: 0 }],
		    [{ id: 4, name: 'Regular fries', priceChange: 0 }, { id: 5, name: 'Curly fries', priceChange: 0.5 }],
		    [{ id: 6, name: 'Lettuce', priceChange: 0 }],
		]
	}
	
	$scope.typeaheadItems = [
	   { id: 4, name: 'Regular fries', priceChange: 0 },
	   { id: 5, name: 'Curly fries', priceChange: 0.5 }, 
	   { id: 2, name: 'Onions', priceChange: 0 }, 
	   { id: 1, name: 'Beef', priceChange: 0 }
	];
	
	$scope.filteredIngredients = angular.copy($scope.typeaheadItems);
	
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
	
});
