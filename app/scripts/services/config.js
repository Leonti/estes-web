'use strict';

angular.module('estesWebApp').service('Config', ['$q', '$http', function Config($q, $http) {
	
	var get = function() {
		var deferred = $q.defer();
		
		$http.get('/config.json').success(function(data) {
			deferred.resolve(data);
		}).error(function() {
			deferred.reject('Error loading config!');
		});
		
		return deferred.promise;
	};
	
	var configPromise = get();
	
	return {
		get: function() {
			return configPromise;
		}
	};
	
}]);
