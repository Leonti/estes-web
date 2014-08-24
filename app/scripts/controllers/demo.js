'use strict';

angular.module('estesWebApp').controller('DemoCtrl', ['$scope', 'storage', '$location', '$timeout',
                                                      function($scope, storage, $location, $timeout) {

	$scope.reset = function() {
		storage.clearAll();
	}
}]);
