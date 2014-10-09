'use strict';

angular.module('estesWebApp', [ 'ngCookies' ]).controller('OauthCtrl',
[ '$scope', '$location', '$http', '$cookies', 'Config', 'User', function($scope, $location, $http, $cookies, Config, User) {

	$scope.error = undefined;
	
	function parseKeyValue(keyValue) {
		var obj = {}, value, key;
		angular.forEach((keyValue || '').split('&'), function(keyValue) {
			if (keyValue) {
				value = keyValue.split('=');
				key = decodeURIComponent(value[0]);
				obj[key] = angular.isDefined(value[1]) ? decodeURIComponent(value[1]) : true;
			}
		});
		return obj;
	}
	var queryString = $location.path().substring(1); // preceding

	var params = parseKeyValue(queryString);

	Config.get().then(function(config) {
		$http.get(config.backendBaseUrl + '/login/' + params.access_token).success(function(data) {
			console.log(data);
			
			if (!data.error) {
				User.saveUserSession(data);
				window.location.href = '/';
			} else {
				$scope.error = data.error_description;
			}
			
		}).error(function() {
			$scope.error = 'Error authenticating';
		});		
	});
	

} ]);