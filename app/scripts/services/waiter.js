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
				return $q.when(storage.get('mockWaiters'));
			}
		}
	}
	
}]);
