'use strict';

angular.module('estesWebApp').controller('DemoCtrl', ['$scope', 'storage', function($scope, storage) {

	$scope.reset = function() {
		storage.clearAll();
		document.location.href = document.location.protocol + '//' + document.location.host;
	};

}]);
