'use strict';

angular.module('estesWebApp').controller('SettingsCtrl', ['$scope', 'Settings', 'Printer', function($scope, Settings, Printer) {
	
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
	
}]);
