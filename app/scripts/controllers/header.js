'use strict';

angular.module('estesWebApp').controller('HeaderCtrl', ['$rootScope', '$scope', '$location', 'User', function($rootScope, $scope, $location, User) {

	function isStation(url) {
		var stationRoutes = ['orders', 'kitchen', 'dashboard'];
		return _.some(stationRoutes, function(route) {
			return url.indexOf('/' + route) !== -1;
		});
	}
	
	$rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
		$scope.isStation = isStation(newUrl);
	});
	
	if (isStation($location.url())) {
		$scope.isStation = true;
	}
	
	$scope.isLoggedIn = false;
	
	User.checkAndRedirect();
	
	if (User.getUserSession() !== null) {
		$scope.isLoggedIn = true;
	}
	
}]);
