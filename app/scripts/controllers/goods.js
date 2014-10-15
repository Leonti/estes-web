'use strict';

angular.module('estesWebApp').controller('GoodsCtrl', ['$scope', 'Goods', function($scope, Goods) {

	$scope.groupInEditing = null;
	$scope.articleGroupInEditing = null;
	$scope.articleInEditing = null;
	
	Goods.readGroups().then(function(groups) {
		$scope.groups = groups;
	});
	
	$scope.save = function(groups) {
		Goods.saveGroups(groups);
		$scope.cancelGroupEditing();
		$scope.cancelArticleEditing();
	}
	
	$scope.formatTax = Goods.formatTax;
	
	$scope.startGroupEditing = function(index) {
		$scope.groupInEditing = index;
	} 
	
	$scope.cancelGroupEditing = function() {
		$scope.groupInEditing = null;
	}
	
	$scope.startArticleEditing = function(groupIndex, index) {
		$scope.articleGroupInEditing = groupIndex;
		$scope.articleInEditing = index;
	} 
	
	$scope.cancelArticleEditing = function() {
		$scope.articleGroupInEditing = null;
		$scope.articleInEditing = null;
	} 	
	
}]);
