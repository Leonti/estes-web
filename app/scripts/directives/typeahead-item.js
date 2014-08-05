'use strict';

angular.module('estesWebApp').directive('typeaheadItem', function () {
    return {
      restrict: 'A',
      require: '^typeahead',
      link: function postLink(scope, element, attrs, controller) {
    	  var item = scope.$eval(attrs.typeaheadItem);
    	  
    	  scope.$watch(function() { return controller.isActive(item); }, function(active) {
	    	  if (active) {
	    		  element.addClass('active');
	    	  } else {
	    		  element.removeClass('active');
	    	  }
    	  });
    	  
    	  element.bind('mouseover', function() {
    		  scope.$apply(function() { controller.mousedOver(true); });
    	  });
	   
    	  element.bind('mouseleave', function() {
    		  scope.$apply(function() { controller.mousedOver(false); });
    	  });
    	  
    	  element.bind('mouseenter', function(e) {
    		  scope.$apply(function() { controller.activate(item); });
    	  });
    	   
    	  element.bind('click', function(e) {
    		  scope.$apply(function() { controller.select(item); });
    	  });
      }
    };
  });
