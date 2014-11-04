'use strict';
/*global _:false */

angular.module('estesWebApp').service('Article', ['Rest', 'Restangular', function(Rest, Restangular) {
	
	function getTags(articles) {
		return _.uniq(_.flatten(_.map(articles, function(article) { return article.tags; })));
	}
	
	function getOptions(articles) {
		return _.uniq(_.flatten(_.map(articles, function(article) { return article.articleOptions; })), 
			function (articleOption) {
				return articleOption.id;
			});
	}

	function getTaxGroups(articles) {
		return _.uniq(_.map(articles, function(article) { return article.taxGroup; }), 
			function (taxGroup) {
				return taxGroup.id;
			});
	}
	
	function generateId() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		    return v.toString(16);
		});
	}	
		
	return {
		
		readAll: function() {
			return Rest.configure().then(function() {
				return Restangular.all('article').getList();	
			});
		},
		save: function(article) {
			return Rest.configure().then(function() {
				if (article.id === undefined || article.id === null) {
					return Restangular.one('article').post('', article);
				} else {
					return Restangular.one('article', article.id.id).customPUT(article);
				}
			});
		},
		remove: function(id) {
			return Rest.configure().then(function() {
				return Restangular.all('article').getList().then(function(articles) {
					for (var i = 0; i < articles.length; i++) {
						if (articles[i].id.id === id.id) {
							return Restangular.one('article', id.id).customDELETE();
						}
					}
				});					
			});
		},
		getTaxGroups: getTaxGroups,			
		getTags: getTags,
		getOptions: getOptions,
		generateId: generateId
	};		
		
}]);
