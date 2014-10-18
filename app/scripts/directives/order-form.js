'use strict';
/*global _:false */

angular.module('estesWebApp').directive('orderForm', ['Waiter', 'Dish', 'Order', 'Settings', 'Printer', 
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
			scope.dishList = null;
			scope.dishListExpanded = false;
			scope.orderFormDish = null;
			scope.addingNewDish = false;
			scope.orderDishEditIndex = null;
			scope.discount = '0';
			var viewOverride = null;
			
			scope.$watch('order', function(order) {
				viewOverride = null;
				scope.discount = '0';
				
				if (order) {
					scope.discount = Order.formatDiscount(order.discount);
				}
			});
			
			Waiter.readAll().then(function(waiters) {
				scope.waiterList = waiters;
				scope.order = new OrderTemplate(waiters[0]);
			});

			Article.readAll().then(function(dishList) {
				scope.dishList = dishList;
				
				scope.menus = Article.getMenus(dishList);
				scope.selectedMenus = angular.copy(scope.menus);
			});
			
			var settingsPromise = Settings.read();
			
			scope.filterDish = function(article) {
		    	var menuFilter = _.some(article.menus, function(menu) {
		    		return scope.selectedMenus.indexOf(menu) !== -1;
		    	});	
		    
		    	function isInSearch(article) {
		    		return scope.searchTerm.length > 0 ? article.name.toUpperCase().indexOf(scope.searchTerm.toUpperCase()) !== -1 : true;
		    	}
		    	
		    	return menuFilter && isInSearch(article);
			};	
			
			scope.waiterToLabel = function(waiter) {
				return waiter.name;
			};
			
			scope.showAddDish = function() {
				scope.addingNewDish = true;
			};
			
			scope.hideAddDish = function() {
				scope.addingNewDish = false;
			};
			
			scope.toggleDishList = function() {
				scope.dishListExpanded = !scope.dishListExpanded;
			};
			
			scope.configDish = function(article) {	
				settingsPromise.then(function(settings) {
					scope.orderFormDish = Order.toOrderDish(article, settings.tax);
				});
			};
			
			scope.addDishToOrder = function(article) {
				scope.order.articles.push(article);
				scope.orderFormDish = null;
				scope.addingNewDish = false;
			};
			
			scope.cancelAddingDish = function() {
				scope.orderFormDish = null;
			};
			
			scope.startEditingOrderDish = function(index) {
				scope.orderDishEditIndex = index;
			}
			
			scope.saveEditedOrderDish = function(article, index) {
				scope.orderDishEditIndex = null;
				scope.order.articles[index] = article;
			}
			
			scope.cancelEditingOrderDish = function() {
				scope.orderDishEditIndex = null;
			}
			
			scope.isDishOrderBeingEdited = function(index) {
				return index === scope.orderDishEditIndex;
			}
			
			scope.updateDiscount = function(order, discount) {
				order.discount = Order.parseDiscount(discount);
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
