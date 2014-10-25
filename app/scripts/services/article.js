'use strict';
/*global _:false */

angular.module('estesWebApp').factory('Article', ['$q', 'storage', 'Demo', 'Rest', 'Restangular', function($q, storage, Demo, Rest, Restangular) {
	
	function getTags(articles) {
		return _.uniq(_.flatten(_.map(articles, function(article) { return article.tags; })));
	}
	
	function getOptions(articles) {
		return _.uniq(_.flatten(_.map(articles, function(article) { return article.options; })), 
			function (option) {
				return option.id;
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
	
	function ArticleMock($q, storage) {
		
		var articleOptions =  [
		            		   [{ name: 'Regular fries', priceChange: '0', id: generateId() }, { name: 'Curly fries', priceChange: '0.5', id: generateId() }],
		            		   [{ name: 'Onions', priceChange: '0', id: generateId() }], 
		            		   [{ name: 'Beef', priceChange: '0', id: generateId() }]
		            		];
		
		var taxGroup = {
				name: 'Food',
				tax: '7.0',
				id: generateId()
			};
		
		function generateArticlesForTags(tags, idBase) {
			var articles = [];
			var titleBase = '';
			for (var i = 0; i < tags.length; i++) {
				titleBase += '_' + tags[i];
			}
			for (i = 0; i < 10; i++) {
				articles.push({
					id: {userId: 1, id: idBase + i},
					name: 'Article ' + titleBase + '_' + i,
					price: '10',
					tags: tags,
					options: articleOptions,
					taxGroup: taxGroup,
					kitchen: true
				});
			}
			
			return articles;
		}
		
		var generateFakeArticles = function() {
			var allArticles = [];
			allArticles = allArticles.concat(generateArticlesForTags(['Breakfast'], allArticles.length));
			allArticles = allArticles.concat(generateArticlesForTags(['Lunch'], allArticles.length));
			allArticles = allArticles.concat(generateArticlesForTags(['Dinner'], allArticles.length));
			allArticles = allArticles.concat(generateArticlesForTags(['Dinner', 'Breakfast'], allArticles.length));
			allArticles = allArticles.concat(generateArticlesForTags(['Dinner', 'Lunch'], allArticles.length));
			allArticles = allArticles.concat(generateArticlesForTags(['Breakfast', 'Lunch', 'Dinner'], allArticles.length));
			return allArticles;
		};
		
		var saveArticle = function(article) {
			var articles = storage.get('mockArticles');
			
			if (article.id === undefined || article.id === null) {
				article.id = {userId: 1, id: articles.length + 1};
				articles.push(article);
			} else {
				for (var i = 0; i < articles.length; i++) {
					if (articles[i].id.id === article.id.id) {
						articles[i] = article;
					}
				}
			}
			storage.set('mockArticles', articles);
			return article;
		};
		
		var saveTaxGroup = function(taxGroup) {
			var taxGroups = storage.get('mockTaxGroups');
			
			if (taxGroup.id === undefined || taxGroup.id === null) {
				taxGroup.id = {userId: 1, id: taxGroup.length + 1};
				taxGroup.push(taxGroup);
			} else {
				for (var i = 0; i < taxGroup.length; i++) {
					if (taxGroup[i].id.id === taxGroup.id.id) {
						taxGroup[i] = taxGroup;
					}
				}
			}
			storage.set('mockTaxGroups', taxGroups);
			return taxGroup;
		};		
		
		var removeArticle = function(id) {
			var articles = storage.get('mockArticles');
			for (var i = 0; i < articles.length; i++) {
				if (articles[i].id.id === id.id) {
					articles.splice(i, 1);
				}
			}
			storage.set('mockArticles', articles);
		};
		
		var removeTaxGroup = function(id) {
			var taxGroups = storage.get('mockTaxGroups');
			for (var i = 0; i < taxGroups.length; i++) {
				if (taxGroups[i].id.id === id.id) {
					taxGroups.splice(i, 1);
				}
			}
			storage.set('mockTaxGroups', taxGroups);
		};		
		
		if (!storage.get('mockArticles')) {
			storage.set('mockArticles', generateFakeArticles());
		}
		
		return {
			readAll: function() {
				return $q.when(angular.copy(storage.get('mockArticles')));
			},
			save: function(article) {
				return $q.when(saveArticle(article));
			},
			remove: function(id) {
				return $q.when(removeArticle(id));
			},
			getTaxGroups: getTaxGroups,		
			getTags: getTags,
			getOptions: getOptions,
			generateId: generateId
		};
	}
	
	function Article(Rest, Restangular) {
		
		return {
			
			readAll: function() {
				return Rest.configure().then(function() {
					return Restangular.all('article').getList();	
				});
			},
			save: function(article) {
				article.selectedOptions = [];
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
	}

	if (Demo.isEnabled()) {
		return new ArticleMock($q, storage);
	} else {
		return new Article(Rest, Restangular);
	}
	
}]);
