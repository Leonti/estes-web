'use strict';

angular.module('estesWebApp').controller('SettingsCtrl', ['$scope', 'Settings', function($scope, Settings) {
	
	$scope.availablePrinters = ['BROWSER', 'JAVA APPLET'];
	
	Settings.read().then(function(settings) {
		$scope.settings = settings;
	});
	
	$scope.saveSettings = function(settings) {
		Settings.save(settings);
	} 
	
	$scope.printerToLabel = function(printer) {
		return printer.toLowerCase();
	}
	
}]);
