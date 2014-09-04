'use strict';

angular.module('estesWebApp').controller('DemoCtrl', ['$scope', 'storage',
                                                      function($scope, storage) {

	$scope.reset = function() {
		storage.clearAll();
	};
}]);
