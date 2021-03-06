'use strict';

angular.module('estesWebApp').directive('dropdown', function () {
    return {
      templateUrl: '/views/directives/dropdown.html',
      replace: true,
      restrict: 'E',
      scope: {
    	  items: '=',
    	  selectedItem: '=',
    	  toLabel: '&'
      },
      link: function postLink(scope) {
    	  
    	  scope.dropdownOpened = false;
    	  
		  scope.convertToLabel = function(item) {
			  if (item === undefined) {
				  return;
			  }
			  var label = scope.toLabel({item: item});
			  return label ? label : item;
		  };    	  
    	  
    	  scope.select = function(item) {
    		  scope.selectedItem = item;
    		  scope.dropdownOpened = false;
    	  };
    	  
    	  scope.toggle = function() {
    		  scope.dropdownOpened = !scope.dropdownOpened;
    	  }
      }
    };
});
