'use strict';

angular.module('estesWebApp').controller('HistoryCtrl', ['$scope', 'Order', function($scope, Order) {
	
	$scope.dateStart = null;
	$scope.dateEnd = null;
	
	function refresh(dateStart, dateEnd) {
		console.log(dateStart + ' ' + dateEnd);
	}

	$scope.$watch('dateStart', function(dateStart) {
		if ($scope.dateEnd !== null) {
			refresh(dateStart, $scope.dateEnd);
		}
	});
	
	$scope.$watch('dateEnd', function(dateEnd) {
		if ($scope.dateStart !== null) {
			refresh($scope.dateStart, dateEnd);
		}		
	});
	
}]);
