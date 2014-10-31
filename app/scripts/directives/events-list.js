'use strict';

angular.module('estesWebApp').directive('eventsList', ['$interval', '$q', 'Event', 'Order', function($interval, $q, Event, Order) {
	return {
		templateUrl : '/views/directives/events-list.html',
		restrict : 'E',
		scope : {
			type: '@'
		},
		link : function postLink(scope, element, attrs) {

			var ordersCache = {};
			
			scope.orderEvents = null;
			
			var refreshEvents = function() {
				Event.readAll().then(function(events) {
					
					events.sort(function(event1, event2) {
						return event2.timestamp - event1.timestamp;
					});			
									
					var orderPromises = [];
					_.each(events, function(event) {
						if (event.orderPrepared && !ordersCache[event.orderPrepared.orderId.id]) {
							orderPromises.push(Order.read(event.orderPrepared.orderId));
						}	
					});
					
					$q.all(orderPromises).then(function(orders) {
						_.each(orders, function(order) {
							ordersCache[order.id.id] = order; 
						});
						
						var orderEvents = [];
						_.each(events, function(event) {
							if (event.orderPrepared 
									&& event.ack.indexOf(scope.type) === -1) {
								
								orderEvents.push({
									event: event,
									order: ordersCache[event.orderPrepared.orderId.id]
								});
							}	
						});
						
						scope.orderEvents = orderEvents;
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
