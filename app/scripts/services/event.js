'use strict';

angular.module('estesWebApp').factory('Event', ['Rest', 'Restangular',
                                    function Event(Rest, Restangular) {
	return {
		readAll: function() {
			return Rest.configure().then(function() {
				return Restangular.all('event').getList();	
			});			
		},
		ack: function(id, type) {		
			return Rest.configure().then(function() {
				return Restangular.one('event', id.id).customOperation('patch', '', {}, {},
					{ 'op': 'add', 'path': '/ack', 'value': type }		
				);
			});				
		}
	};	

}]);
