'use strict';

angular.module('estesWebApp').controller('LogoutCtrl', ['$scope', '$location', 'User', function($scope, $location, User) {

	User.destroyUserSession().then(function() {
		$location.url("/login");
	});
}]);
