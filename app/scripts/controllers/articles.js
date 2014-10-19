'use strict';
/*global _:false */

angular.module('estesWebApp').controller('ArticlesCtrl', function ($scope, Article) {

	var ArticleTemplate = function() {
		return {
			tags: [],
			options: []
		};
	};
	
	$scope.searchTerm = '';
	$scope.newArticle = null;
	$scope.editedArticleIndex = null;
	
	var refreshArticles = function() {
		Article.readAll().then(function(articles) {
			$scope.articles = articles;
			
			$scope.tags = Article.getTags(articles);
			$scope.selectedTags = [];
			
			$scope.taxGroups = Article.getTaxGroups(articles);
			$scope.selectedTaxGroup = $scope.taxGroups[0];
			
			$scope.options = Article.getOptions(articles);
		});
	};
	refreshArticles();
	
	$scope.isTagSelected = function(tag) {
		return $scope.selectedTags.indexOf(tag) !== -1;
	};
	
	$scope.filterArticle = function(article) {
    	var isInTags = _.some(article.tags, function(tag) {
    		return $scope.selectedTags.indexOf(tag) !== -1;
    	}) || $scope.selectedTags.length === 0;	
    
    	function isInSearch(article) {
    		return $scope.searchTerm.length > 0 ? article.name.toUpperCase().indexOf($scope.searchTerm.toUpperCase()) !== -1: true;
    	}
    	
    	return isInTags && isInSearch(article);
	};
	
	$scope.openNewArticleForm = function() {
		$scope.newArticle = new ArticleTemplate();		
	};
	
	$scope.closeNewArticleForm = function() {
		$scope.newArticle = null;
	};
	
	$scope.saveNewArticle = function(article) {
		Article.save(article).then(refreshArticles);
		$scope.closeNewArticleForm();
	};
	
	$scope.startArticleEdit = function(index) {
		$scope.editedArticleIndex = index;
	};
	
	$scope.removeArticle = function(article) {
		Article.remove(article.id).then(refreshArticles);		
	};

	$scope.closeArticleForm = function() {
		$scope.editedArticleIndex = null;
	};
	
	$scope.saveArticle = function(article) {
		Article.save(article).then(refreshArticles);
		$scope.closeArticleForm();
	};
	
	$scope.isArticleEdited = function(index) {
		return $scope.editedArticleIndex === index;
	};
	
});
