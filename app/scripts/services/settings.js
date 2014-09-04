'use strict';

angular.module('estesWebApp').service('Settings', ['$q', 'storage', function Settings($q, storage) {

	function SettingsMock($q, storage) {
	
		var mockSettings = {
			tax: 7,
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

	return new SettingsMock($q, storage);
	
}]);
