'use strict';

angular.module('estesWebApp').service('Waiter', ['$q', 'storage', 'Demo', 'Rest', 'Restangular', function($q, storage, Demo, Rest, Restangular) {
	
	function WaiterMock($q, storage) {

		var mockWaiters = [{name: 'Leonti', id: 12}, {name: 'Vitali', id: 13}, {name: 'Krishti', id: 14}];
		
		if (!storage.get('mockWaiters')) {
			storage.set('mockWaiters', mockWaiters);
		}
		
		var removeWaiter = function(id) {
			var waiters = storage.get('mockWaiters');
			for (var i = 0; i < waiters.length; i++) {
				if (waiters[i].id === id) {
					waiters.splice(i, 1);
				}
			}
			storage.set('mockWaiters', waiters);
		};
		
		return {
			readAll: function() {
				return $q.when(angular.copy(storage.get('mockWaiters')));
			},
			save: function(waiter) {
				var waiters = storage.get('mockWaiters');

				if (waiter.id === null || waiter.id === undefined) {
					waiter.id = waiter.length;
					waiters.push(waiter);				
				} else {
					for (var i = 0; i < waiters.length; i++) {
						if (waiters[i].id === waiter.id) {
							waiters[i] = waiter;
						}
					}
				}				
				
				storage.set('mockWaiters', waiters);
				return $q.when(waiter);
			},
			remove: function(id) {
				return $q.when(removeWaiter(id));
			},
		};
	}
	
	function Waiter(Rest, Restangular) {
		
		return {
			
			readAll: function() {
				return Rest.configure().then(function() {
					return Restangular.all('waiter').getList();	
				});
			},
			save: function(waiter) {
				return Rest.configure().then(function() {
					if (waiter.id === undefined || waiter.id === null) {
						return Restangular.one('waiter').post('', waiter);
					} else {
						return Restangular.one("waiter", waiter.id.id).customPUT(waiter);
					}
				});
			},
			remove: function(id) {
				return Rest.configure().then(function() {
					return Restangular.all('waiter').getList().then(function(waiters) {
						for (var i = 0; i < waiters.length; i++) {
							if (waiters[i].id.id === id.id) {
								return Restangular.one("waiter", id.id).customDELETE();
							}
						}
					});					
				});
			}
		};		
	}

	if (Demo.isEnabled()) {
		return new WaiterMock($q, storage);
	} else {
		return new Waiter(Rest, Restangular);
	}	
	
}]);
