'use strict';
/*global Big:false */

angular.module('estesWebApp').controller('SettingsCtrl', ['$scope', 'Settings', 'Waiter', 'Printer', function($scope, Settings, Waiter, Printer) {
	
	Printer.getAvailablePrinters().then(function(printers) {		
		$scope.availablePrinters = printers;
	});
	
	Settings.read().then(function(settings) {
		
		var settingsCopy = angular.copy(settings);
		settingsCopy.tax = new Big(settings.tax).times(new Big(100)).toString();
		
		$scope.settings = settingsCopy;
	});
	
	$scope.saveSettings = function(settings) {		
		var settingsCopy = angular.copy(settings);
		settingsCopy.tax = new Big(settings.tax).div(new Big(100)).toString();
		settingsCopy.receiptWidth = parseInt(settings.receiptWidth);
		Settings.save(settingsCopy);
	}; 
	
	$scope.printerToLabel = function(printer) {
		return printer.substring(0, 1) + printer.substring(1).toLowerCase();
	};
	
	var WaiterTemplate = function(waiterName) {
		return {
			name: waiterName
		};
	};
	
	function resetWaiter() {
		$scope.waiter = new WaiterTemplate();
	}
	
	function refreshWaiters() {
		Waiter.readAll().then(function(waiters) {
			$scope.waiters = waiters;
		});
	}
	
	refreshWaiters();
	resetWaiter();	
	
	$scope.addWaiter = function(waiterName) {
		Waiter.save(new WaiterTemplate(waiterName)).then(refreshWaiters);
		resetWaiter();
	};
	
	$scope.removeWaiter = function(waiter) {
		Waiter.remove(waiter.id).then(refreshWaiters);
	};
	
}]);
