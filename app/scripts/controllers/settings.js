'use strict';

angular.module('estesWebApp').controller('SettingsCtrl', ['$scope', 'Settings', 'Waiter', 'Printer', function($scope, Settings, Waiter, Printer) {
	
	Printer.getAvailablePrinters().then(function(printers) {		
		$scope.availablePrinters = printers;
	});
	
	Settings.read().then(function(settings) {
		$scope.settings = settings;
	});
	
	$scope.saveSettings = function(settings) {
		settings.tax = parseFloat(settings.tax);
		settings.receiptWidth = parseInt(settings.receiptWidth);
		Settings.save(settings);
	}; 
	
	$scope.printerToLabel = function(printer) {
		return printer.substring(0, 1) + printer.substring(1).toLowerCase();
	};
	
	var WaiterTemplate = function(waiterName) {
		return {
			name: waiterName
		}
	}
	
	function resetWaiter() {
		$scope.waiter = new WaiterTemplate();
	};
	
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
	}
	
	$scope.removeWaiter = function(waiter) {
		Waiter.remove(waiter.id).then(refreshWaiters);
	}
	
}]);
