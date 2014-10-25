'use strict';

angular.module('estesWebApp').factory('Settings', ['$q', 'storage', 'Rest', 'Restangular', 'Demo', function($q, storage, Rest, Restangular, Demo) {

	
	
	function SettingsMock($q, storage) {
	
		var mockSettings = {
			printer: 'BROWSER',
			receiptWidth: 40
		};
		
		if (!storage.get('mockSettings')) {
			storage.set('mockSettings', mockSettings);
		}	
		
		return {
			read: function() {
				return $q.when(angular.copy(storage.get('mockSettings')));
			},
			save: function(settings) {
				storage.set('mockSettings', angular.copy(settings));
				return $q.when(settings);
			}
		};
	}
	
	function Settings(Rest, Restangular) {
		
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
	}

	if (Demo.isEnabled()) {
		return new SettingsMock($q, storage);
	} else {
		return new Settings(Rest, Restangular);
	}
	
}]);
