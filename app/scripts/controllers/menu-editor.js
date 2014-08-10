'use strict';

angular.module('estesWebApp').controller('MenuEditorCtrl', function ($scope, Dish) {

	$scope.menus = Dish.readAllMenus();
	$scope.selectedMenus = angular.copy($scope.menus);	
	$scope.dishes = Dish.readAll();
	$scope.searchTerm = '';
	
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
	
	
	
});
