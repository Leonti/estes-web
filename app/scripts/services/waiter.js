'use strict';

angular.module('estesWebApp').service('Waiter', function Waiter($q) {

	var fakeWaiters = [{name: 'Leonti', id: 12}, {name: 'Vitali', id: 13}, {name: 'Krishti', id: 14}];
	
	return {
		readAll: function() {
			var deferred = $q.defer();
			deferred.resolve(fakeWaiters);
			return deferred.promise;			
		}
	}
});
