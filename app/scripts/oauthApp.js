angular.module('estesWebApp', [ 'ngCookies' ]).controller('OauthCtrl',
[ '$scope', '$location', '$http', '$cookies', 'Config', function($scope, $location, $http, $cookies, Config) {

	$scope.error = undefined;
	
	function parseKeyValue(keyValue) {
		var obj = {}, key_value, key;
		angular.forEach((keyValue || "").split('&'), function(keyValue) {
			if (keyValue) {
				key_value = keyValue.split('=');
				key = decodeURIComponent(key_value[0]);
				obj[key] = angular.isDefined(key_value[1]) ? decodeURIComponent(key_value[1]) : true;
			}
		});
		return obj;
	}
	var queryString = $location.path().substring(1); // preceding

	var params = parseKeyValue(queryString);

	Config.get().then(function(config) {
		$http.get(config.backendBaseUrl + '/login/' + params.access_token).success(function(data, status, headers, config) {
			console.log(data);
			
			if (!data.error) {
				$cookies.userSession_id = data.id;
				$cookies.userSession_userId = data.userId;
				
				window.location.href = '/';
			} else {
				$scope.error = data.error_description;
			}
			
		}).error(function(data, status, headers, config) {
			$scope.error = "Error authenticating";
		});		
	});
	

} ]);