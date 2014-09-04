'use strict';

angular.module('estesWebApp').directive('pillsFilter', function () {
    return {
      templateUrl: '/views/directives/pills-filter.html',
      replace: true,
      restrict: 'E',
      scope: {
    	  items: '=',
    	  selectedItems: '='
      },
      link: function postLink($scope) {
    		$scope.selected = [];
    		$scope.allSelected = false;
    		
    		$scope.isSelected = function(item) {
    			return $scope.selectedItems.indexOf(item) !== -1;
    		};
    		
    		$scope.toggleAll = function() {
    			if ($scope.allSelected) {
    				$scope.allSelected = false;
    				$scope.selectedItems = [];
    			} else {
    				$scope.allSelected = true;
    				$scope.selectedItems = angular.copy($scope.items);
    			}
    		};
    		
    		$scope.toggleItem = function(item) {
    			$scope.allSelected = false;
    			
    			if ($scope.selectedItems.indexOf(item) !== -1) {
    				$scope.selectedItems.splice($scope.selectedItems.indexOf(item), 1);
    			} else {
    				$scope.selectedItems.push(item);
    			}
    		};    	  
      }
    };
  });
