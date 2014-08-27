'use strict';

angular.module('estesWebApp').controller('SettingsCtrl', ['$scope', 'Settings', function($scope, Settings) {
	
	Settings.read().then(function(settings) {
		$scope.settings = settings;
	});
	
}]);
