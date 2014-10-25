'use strict';

angular.module('estesWebApp').directive('pillsFilter', function () {
    return {
      templateUrl: '/views/directives/pills-filter.html',
      replace: true,
      restrict: 'E',
      scope: {
    	  items: '=',
    	  selectedItems: '=',
    	  id: '&',
    	  toLabel: '&'
      },
      link: function postLink(scope) {
    		scope.selected = [];
    		scope.allSelected = false;
    		
    		function findSelectedIndex(item) {
    			var selectedItemIndex = -1;
    			_.each(scope.selectedItems, function(itemToMatch, index) {
    				if (scope.id({item: itemToMatch}) === scope.id({item: item})) {
    					selectedItemIndex = index;
    				}
    			});
    			
    			return selectedItemIndex;
    		}
    		
    		scope.isSelected = function(item) {
    			return findSelectedIndex(item) !== -1;
    		};
    		
    		scope.toString = function(item) {
    			return scope.toLabel({item: item});
    		}
    		
    		scope.$watch('selectedItems', function(selectedItems) {
    			if (!selectedItems || !scope.items) { return; }
    			
    			if (selectedItems.length === scope.items.length) {
    				scope.allSelected = true;
    			} else {
    				scope.allSelected = false;
    			}
    		}, true);
    		
    		scope.toggleAll = function() {
    			if (scope.allSelected) {
    				scope.allSelected = false;
    				scope.selectedItems = [];
    			} else {
    				scope.allSelected = true;
    				scope.selectedItems = angular.copy(scope.items);
    			}
    		};
    		
    		scope.toggleItem = function(item) {
    			scope.allSelected = false;
    		
    			var selectedItemIndex = findSelectedIndex(item);
    			if (selectedItemIndex != -1) {
    				scope.selectedItems.splice(selectedItemIndex, 1);
    			} else {
    				scope.selectedItems.push(item);
    			}
    		};
    		
      }
    };
  });
