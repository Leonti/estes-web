'use strict';

angular.module('estesWebApp').controller('HeaderCtrl', ['$scope', '$location', 'User', function($scope, $location, User) {

	$scope.isLoggedIn = false;
	$scope.isStation = $location.url() === '/orders' || $location.url() === '/kitchen' ? true : false;
	
	User.checkAndRedirect();
	
	if (User.getUserSession() !== null) {
		$scope.isLoggedIn = true;
	}
	
}]);
