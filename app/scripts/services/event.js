'use strict';

angular.module('estesWebApp').factory('Event', ['$q', 'storage', 'Demo', 'Rest', 'Restangular',
                                    function Event($q, storage,  Demo, Rest, Restangular) {
	
	function EventMock($q, storage) {

		function generateId() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			    return v.toString(16);
			});
		}		
		
		var mockEvents = [];

		for (var i = 0; i < 10; i++) {
			mockEvents.push({
				id: {userId: 1, id: i},
				timestamp: Date.now(),
				articlePrepared: {
					orderId: {userId: 1, id: i},
					articleId: generateId()
				}
			});
		}
		
		if (!storage.get('mockEvents')) {			
			storage.set('mockEvents', mockEvents);
		}
		
		return {
			readAll: function() {
				return $q.when(angular.copy(storage.get('mockEvents')));			
			}
		};	
	}
	
	
	if (Demo.isEnabled()) {
		return new EventMock($q, storage);
	} else {
		return new Event(Rest, Restangular);
	}
}]);
