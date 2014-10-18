'use strict';
/*global _:false */

angular.module('estesWebApp').factory('Article', ['$q', 'storage', 'Demo', 'Rest', 'Restangular', function($q, storage, Demo, Rest, Restangular) {
	
	function getTags(articles) {
		return _.uniq(_.flatten(_.map(articles, function(article) { return article.tags; })));
	}
	
	function getOptions(articles) {
		return _.uniq(_.flatten(_.map(articles, function(article) { return article.options; })), 
			function (option) {
				return option.name + option.priceChange;
			});
	}
	
	function ArticleMock($q, storage) {
		
		var mockTags = ['Breakfast', 'Lunch', 'Dinner'];
		
		var mockOptions = [
		            		   { name: 'Regular fries', priceChange: '0' },
		            		   { name: 'Curly fries', priceChange: '0.5' }, 
		            		   { name: 'Onions', priceChange: '0' }, 
		            		   { name: 'Beef', priceChange: '0' }
		            		];
		
		var articleOptions =  [
		            		   [{ name: 'Regular fries', priceChange: '0' }, { name: 'Curly fries', priceChange: '0.5' }],
		            		   [{ name: 'Onions', priceChange: '0' }], 
		            		   [{ name: 'Beef', priceChange: '0' }]
		            		];
		
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
					options: articleOptions
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
		
		var removeArticle = function(id) {
			var articles = storage.get('mockArticles');
			for (var i = 0; i < articles.length; i++) {
				if (articles[i].id.id === id.id) {
					articles.splice(i, 1);
				}
			}
			storage.set('mockArticles', articles);
		};
		
		if (!storage.get('mockArticles')) {
			storage.set('mockArticles', generateFakeArticles());
			storage.set('mockTags', mockTags);
			storage.set('mockOptions', mockOptions);			
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
			getTags: getTags,
			getOptions: getOptions
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
			getTags: getTags,
			getOptions: getOptions
		};		
	}

	if (Demo.isEnabled()) {
		return new ArticleMock($q, storage);
	} else {
		return new Article(Rest, Restangular);
	}
	
}]);
