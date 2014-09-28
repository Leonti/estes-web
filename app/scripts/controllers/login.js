'use strict';

angular.module('estesWebApp').controller('LoginCtrl', ['$scope', 'Config', function($scope, Config) {
	
	Config.get().then(function(config) {
		console.log(config);
		var callbackUrl = config.baseUrl + '/oauth2callback.html';
		$scope.oauthUrl = 'https://accounts.google.com/o/oauth2/auth?scope=email%20profile&state=%2Fprofile&redirect_uri='
			+ callbackUrl + '&response_type=token&client_id=' + config.oauthClientId;
	});
	
}]);
