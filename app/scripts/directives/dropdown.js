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
      link: function postLink(scope, element, attrs) {
    	  
		  scope.convertToLabel = function(item) {
			  var label = scope.toLabel({item: item});
			  return label ? label : item;
		  }    	  
    	  
    	  scope.select = function(item) {
    		  scope.selectedItem = item;
    	  }
      }
    };
});
