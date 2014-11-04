'use strict';
/*global _:false */

angular.module('estesWebApp').controller('ArticlesCtrl', function ($scope, Article) {

	var ArticleTemplate = function(taxGroup) {
		return {
			tags: [],
			articleOptions: [],
			taxGroup: taxGroup
		};
	};
	
	$scope.searchTerm = '';
	$scope.newArticle = null;
	$scope.editedArticleIndex = null;
	$scope.selectedTaxGroups = [];
	
	var refreshArticles = function() {
		Article.readAll().then(function(articles) {
			$scope.articles = articles;
			$scope.tags = Article.getTags(articles);
			$scope.selectedTags = [];
			
			$scope.taxGroups = Article.getTaxGroups(articles);
			$scope.selectedTaxGroup = $scope.taxGroups[0];
			
			$scope.articleOptions = Article.getOptions(articles);
		});
	};
	refreshArticles();
	
	$scope.filterArticle = function(article) {
    	var isInTags = _.some(article.tags, function(tag) {
    		return $scope.selectedTags.indexOf(tag) !== -1;
    	}) || $scope.selectedTags.length === 0;	
    
    	var isInTaxGroups = _.some($scope.selectedTaxGroups, function(taxGroup) {
    		return article.taxGroup.id === taxGroup.id;
    	}) || $scope.selectedTaxGroups.length === 0;
    	
    	var isInSearch = $scope.searchTerm.length > 0 ? article.name.toUpperCase().indexOf($scope.searchTerm.toUpperCase()) !== -1: true;
    	
    	return isInTags && isInTaxGroups && isInSearch;
	};
	
	$scope.updateTaxGroups = function(taxGroup) {
		
		if ($scope.selectedTaxGroup.id === taxGroup.id) {
			$scope.selectedTaxGroup = taxGroup;
		}
		
		_.each($scope.articles, function(article) {
			if (article.taxGroup.id === taxGroup.id) {
				article.taxGroup = taxGroup;
				Article.save(article);
			}
		});
	}
	
	$scope.toTaxGroupLabel = function(taxGroup) {
		return taxGroup.name;
	}
	
	$scope.openNewArticleForm = function() {
		$scope.newArticle = new ArticleTemplate($scope.selectedTaxGroup);		
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
