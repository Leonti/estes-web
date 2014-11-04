'use strict';

angular.module('estesWebApp').directive('eventList', ['$interval', '$q', 'Event', 'Order', function($interval, $q, Event, Order) {
	return {
		templateUrl : '/views/directives/event-list.html',
		restrict : 'E',
		scope : {
			type: '@'
		},
		link : function postLink(scope, element, attrs) {

			var ordersCache = {};
			
			scope.articleEvents = null;
			
			function findEvent(order, articleId) {
				return _.find(order.articles, function(article) {
					return article.id === articleId;
				});
			}
			
			var refreshEvents = function() {
				Event.readAll().then(function(events) {
					
					events.sort(function(event1, event2) {
						return event2.timestamp - event1.timestamp;
					});			
									
					var orderPromises = [];
					_.each(events, function(event) {
						if (event.articlePrepared && !ordersCache[event.articlePrepared.orderId.id]) {
							orderPromises.push(Order.read(event.articlePrepared.orderId));
						}	
					});
					
					$q.all(orderPromises).then(function(orders) {
						_.each(orders, function(order) {
							ordersCache[order.id.id] = order; 
						});
						
						var articleEvents = [];
						_.each(events, function(event) {
							if (event.articlePrepared 
									&& event.ack.indexOf(scope.type) === -1) {
								
								var order = ordersCache[event.articlePrepared.orderId.id];
								articleEvents.push({
									event: event,
									order: order,
									article: findEvent(order, event.articlePrepared.articleId)
								});
							}	
						});
						
						scope.articleEvents = articleEvents;
					});
				});
			}
			
			refreshEvents();
			
			scope.hideEvent = function(event) {
				Event.ack(event.id, scope.type).then(refreshEvents);
			}
			
			var eventsPoll = $interval(refreshEvents, 2000);
			scope.$on('$destroy', function() {
				$interval.cancel(eventsPoll);
			});				
		}
	};
}]);
