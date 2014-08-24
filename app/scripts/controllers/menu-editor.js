'use strict';

angular.module('estesWebApp').controller('MenuEditorCtrl', function ($scope, Dish) {

	var DishTemplate = function() {
		return {
			menus: [],
			ingredients: []
		}
	}
	
	Dish.readAllMenus().then(function(menus) {
		$scope.menus = menus;
		$scope.selectedMenus = angular.copy($scope.menus);	
	});
	
	var refreshDishes = function() {
		Dish.readAll().then(function(dishes) {
			$scope.dishes = dishes;
		});
	}
	
	refreshDishes();
	
	$scope.searchTerm = '';
	$scope.newDish = null;
	$scope.editedDishIndex = null;
	
	$scope.isMenuSelected = function(menu) {
		return $scope.selectedMenus.indexOf(menu) != -1;
	}
	
	$scope.filterDish = function(dish) {
    	var menuFilter = _.some(dish.menus, function(menu) {
    		return $scope.selectedMenus.indexOf(menu) != -1;
    	});	
    
    	function isInSearch(dish) {
    		return $scope.searchTerm.length > 0 ? dish.name.toUpperCase().indexOf($scope.searchTerm.toUpperCase()) != -1: true;
    	}
    	
    	return menuFilter && isInSearch(dish);
	}
	
	$scope.openNewDishForm = function() {
		$scope.newDish = DishTemplate();		
	}
	
	$scope.closeNewDishForm = function() {
		$scope.newDish = null;
	}
	
	$scope.saveNewDish = function(dish) {
		Dish.save(dish).then(refreshDishes);
		$scope.closeNewDishForm();
	}
	
	$scope.startDishEdit = function(index) {
		$scope.editedDishIndex = index;
	}
	
	$scope.removeDish = function(dish) {
		Dish.remove(dish.id).then(refreshDishes);		
	}

	$scope.closeDishForm = function() {
		$scope.editedDishIndex = null;
	}
	
	$scope.saveDish = function(dish, index) {
		Dish.save(dish).then(refreshDishes);
		$scope.closeDishForm();
	}
	
	$scope.isDishEdited = function(index) {
		return $scope.editedDishIndex == index;
	}
	
});
