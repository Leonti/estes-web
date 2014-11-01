'use strict';

angular.module('estesWebApp').service('Waiter', ['Rest', 'Restangular', function(Rest, Restangular) {

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
					return Restangular.one('waiter', waiter.id.id).customPUT(waiter);
				}
			});
		},
		remove: function(id) {
			return Rest.configure().then(function() {
				return Restangular.all('waiter').getList().then(function(waiters) {
					for (var i = 0; i < waiters.length; i++) {
						if (waiters[i].id.id === id.id) {
							return Restangular.one('waiter', id.id).customDELETE();
						}
					}
				});					
			});
		}
	};			
	
}]);
