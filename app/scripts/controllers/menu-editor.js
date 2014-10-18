'use strict';
/*global _:false */

angular.module('estesWebApp').controller('MenuEditorCtrl', function ($scope, Article) {

	var DishTemplate = function() {
		return {
			menus: [],
			ingredients: []
		};
	};
	
	var refreshDishes = function() {
		Article.readAll().then(function(articles) {
			$scope.articles = articles;
			
			$scope.menus = Article.getMenus(articles);
			console.log($scope.menus);
			$scope.selectedMenus = [];
			
			$scope.ingredients = Article.getIngredients(articles);
		});
	};
	
	refreshDishes();
	
	$scope.searchTerm = '';
	$scope.newDish = null;
	$scope.editedDishIndex = null;
	
	$scope.isMenuSelected = function(menu) {
		return $scope.selectedMenus.indexOf(menu) !== -1;
	};
	
	$scope.filterDish = function(article) {
    	var isInMenus = _.some(article.menus, function(menu) {
    		return $scope.selectedMenus.indexOf(menu) !== -1;
    	}) || $scope.selectedMenus.length === 0;	
    
    	function isInSearch(article) {
    		return $scope.searchTerm.length > 0 ? article.name.toUpperCase().indexOf($scope.searchTerm.toUpperCase()) !== -1: true;
    	}
    	
    	return isInMenus && isInSearch(article);
	};
	
	$scope.openNewDishForm = function() {
		$scope.newDish = new DishTemplate();		
	};
	
	$scope.closeNewDishForm = function() {
		$scope.newDish = null;
	};
	
	$scope.saveNewDish = function(article) {
		Article.save(article).then(refreshDishes);
		$scope.closeNewDishForm();
	};
	
	$scope.startDishEdit = function(index) {
		$scope.editedDishIndex = index;
	};
	
	$scope.removeDish = function(article) {
		Article.remove(article.id).then(refreshDishes);		
	};

	$scope.closeDishForm = function() {
		$scope.editedDishIndex = null;
	};
	
	$scope.saveDish = function(article) {
		Article.save(article).then(refreshDishes);
		$scope.closeDishForm();
	};
	
	$scope.isDishEdited = function(index) {
		return $scope.editedDishIndex === index;
	};
	
});
