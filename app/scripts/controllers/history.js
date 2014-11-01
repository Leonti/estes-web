'use strict';

angular.module('estesWebApp').controller('HistoryCtrl', ['$scope', 'Order', function($scope, Order) {
	
	$scope.dateStart = null;
	$scope.dateEnd = null;
	$scope.orders = null;
	$scope.price = null;
	$scope.discount = null;
	$scope.tax = null;
	$scope.total = null;
	
	function refresh(dateStart, dateEnd) {
		console.log(dateStart + ' ' + dateEnd);
		
		Order.readInRange(dateStart, dateEnd).then(function(orders) {
			$scope.orders = orders;
			
			$scope.price = Order.calculatePriceForList(orders);
			$scope.discount = Order.calculateDiscountForList(orders);
			$scope.tax = Order.calculateTaxForList(orders);
			$scope.total = Order.calculateTotalForList(orders);			
		});
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
