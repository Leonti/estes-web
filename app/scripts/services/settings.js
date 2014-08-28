'use strict';

angular.module('estesWebApp').service('Settings', ['$q', 'storage', function Settings($q, storage) {

	return new SettingsMock($q, storage);
	
	
	function SettingsMock($q, storage) {
	
		var mockSettings = {
			tax: 0.07,
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
				storage.set('settings', angular.copy(settings));
				return $q.when(settings);
			}
		}
	}	

}]);
