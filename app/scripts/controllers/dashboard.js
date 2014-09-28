'use strict';

angular.module('estesWebApp').controller('DashboardCtrl', ['$scope', 'User', function($scope, User) {
	
	console.log(User.getUserSession());
	
}]);
