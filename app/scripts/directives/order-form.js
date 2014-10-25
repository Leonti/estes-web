'use strict';
/*global _:false */

angular.module('estesWebApp').directive('orderForm', ['Waiter', 'Article', 'Order', 'Settings', 'Printer', 
                                              function(Waiter, Article, Order, Settings, Printer) {

	var OrderTemplate = function(waiter) {
		return {
			status: 'PREPARATION',
			discount: '0',
			waiter: waiter,
			articles: [],
			note: null
		};
	};
	
	return {
		templateUrl : 'views/directives/order-form.html',
		replace: true,
		restrict : 'E',
		scope: {
			order: '=',
			onSave: '&'
		},
		link : function postLink(scope) {
			
			scope.waiterList = null;
			scope.searchTerm = '';
			scope.articleList = null;
			scope.articleListExpanded = false;
			scope.orderFormArticle = null;
			scope.addingNewArticle = false;
			scope.orderArticleEditIndex = null;
			var viewOverride = null;
			
			scope.$watch('order', function(order) {
				viewOverride = null;
			});
			
			Waiter.readAll().then(function(waiters) {
				scope.waiterList = waiters;
				scope.order = new OrderTemplate(waiters[0]);
			});

			Article.readAll().then(function(articleList) {
				scope.articleList = articleList;
				
				scope.tags = Article.getTags(articleList);
				scope.selectedTags = angular.copy(scope.tags);
			});
			
			var settingsPromise = Settings.read();
			
			scope.filterArticle = function(article) {
		    	var tagFilter = _.some(article.tags, function(tag) {
		    		return scope.selectedTags.indexOf(tag) !== -1;
		    	});	
		    
		    	function isInSearch(article) {
		    		return scope.searchTerm.length > 0 ? article.name.toUpperCase().indexOf(scope.searchTerm.toUpperCase()) !== -1 : true;
		    	}
		    	
		    	return tagFilter && isInSearch(article);
			};	
			
			scope.waiterToLabel = function(waiter) {
				return waiter.name;
			};
			
			scope.showAddArticle = function() {
				scope.addingNewArticle = true;
			};
			
			scope.hideAddArticle = function() {
				scope.addingNewArticle = false;
			};
			
			scope.toggleArticleList = function() {
				scope.articleListExpanded = !scope.articleListExpanded;
			};
			
			scope.configArticle = function(article) {	
				settingsPromise.then(function(settings) {
					scope.orderFormArticle = Order.toOrderArticle(article, settings.tax);
				});
			};
			
			scope.addArticleToOrder = function(article) {
				scope.order.articles.push(article);
				scope.orderFormArticle = null;
				scope.addingNewArticle = false;
			};
			
			scope.cancelAddingArticle = function() {
				scope.orderFormArticle = null;
			};
			
			scope.startEditingOrderArticle = function(index) {
				scope.orderArticleEditIndex = index;
			}
			
			scope.saveEditedOrderArticle = function(article, index) {
				scope.orderArticleEditIndex = null;
				scope.order.articles[index] = article;
			}
			
			scope.cancelEditingOrderArticle = function() {
				scope.orderArticleEditIndex = null;
			}
			
			scope.isArticleOrderBeingEdited = function(index) {
				return index === scope.orderArticleEditIndex;
			}
			
			scope.save = function(order) {
				resetOrder();
				Order.save(order).then(function() {
					scope.onSave();
				});
			};
			
			scope.paid = function(order) {
				order.status = 'PAID';
				scope.save(order);
			};
			
			scope.cancel = function() {
				resetOrder();
			};
			
			scope.forcePayment = function() {
				viewOverride = 'PAYMENT';
			};

			scope.forceEdit = function() {
				viewOverride = 'EDIT';
			};
			
			scope.isEditView = function() {
				if (viewOverride === 'PAYMENT' || !scope.order) { return false; }
				return scope.order.status === 'PREPARATION' || viewOverride === 'EDIT';
			};
			
			scope.isPaymentView = function() {
				if (viewOverride === 'EDIT' || !scope.order) { return false; }
				
				return scope.order.status !== 'PREPARATION' || viewOverride === 'PAYMENT';
			};
			
			scope.print = function(order) {
				Printer.print(order);
			};
			
			function resetOrder() {
				scope.order = new OrderTemplate(scope.waiterList[0]);
			}
		}
	};
}]);
