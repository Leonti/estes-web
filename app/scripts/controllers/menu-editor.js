'use strict';

angular.module('estesWebApp').controller('MenuEditorCtrl', function ($scope, Dish) {

	Dish.readAllMenus().then(function(menus) {
		$scope.menus = menus;
		$scope.selectedMenus = angular.copy($scope.menus);	
	});
	
	Dish.readAll().then(function(dishes) {
		$scope.dishes = dishes;
	});
	$scope.searchTerm = '';
	$scope.newDishEditing = false;
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
		$scope.newDishEditing = true;		
	}
	
	$scope.closeNewDishForm = function() {
		$scope.newDishEditing = false;
	}
	
	$scope.saveNewDish = function(dish) {
		Dish.save(dish);
		$scope.closeNewDishForm();
	}
	
	$scope.startDishEdit = function(index) {
		$scope.editedDishIndex = index;
	}

	$scope.closeDishForm = function() {
		$scope.editedDishIndex = null;
	}
	
	$scope.saveDish = function(dish, index) {
		console.log(index);
		Dish.save(dish);
		$scope.closeDishForm();
	}
	
	$scope.isDishEdited = function(index) {
		return $scope.editedDishIndex == index;
	}
	
	
});
