'use strict';

angular.module('estesWebApp').service('Config', ['$q', '$http', function Config($q, $http) {
	
	var get = function() {
		var deferred = $q.defer();
		
		$http.get('/config.json').success(function(data, status, headers, config) {
			deferred.resolve(data);
		}).error(function(data, status, headers, config) {
			deferred.reject('Error loading config!');
		});
		
		return deferred.promise;
	}	
	var configPromise = get();
	
	return {
		get: function() {
			return configPromise;
		}
	}
}]);
