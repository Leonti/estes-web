'use strict';

angular.module('estesWebApp').service('Waiter', ['$q', 'storage', function($q, storage) {
	
	return new WaiterMock($q, storage);
	
	function WaiterMock($q, storage) {

		var mockWaiters = [{name: 'Leonti', id: 12}, {name: 'Vitali', id: 13}, {name: 'Krishti', id: 14}];
		
		if (!storage.get('mockWaiters')) {
			storage.set('mockWaiters', mockWaiters);
		}
		
		return {
			readAll: function() {
				return $q.when(angular.copy(storage.get('mockWaiters')));
			},
			save: function(waiter) {
				var waiters = storage.get('mockWaiters');

				if (waiter.id == null || waiter.id == undefined) {
					waiter.id = waiter.length;
					waiters.push(waiter);				
				} else {
					for (var i = 0; i < waiters.length; i++) {
						if (waiters[i].id == waiter.id) {
							waiters[i] = waiter;
						}
					}
				}				
				
				storage.set('mockWaiters', waiters);
				return $q.when(waiter);
			}
		}
	}
	
}]);
