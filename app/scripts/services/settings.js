'use strict';

angular.module('estesWebApp').service('Settings', ['Rest', 'Restangular', function(Rest, Restangular) {
	
	return {
		read: function() {
			return Rest.configure().then(function() {
				return Restangular.one('settings').get();	
			});
		},
		save: function(settings) {
			return settings.put();
		}
	};		
	
}]);
