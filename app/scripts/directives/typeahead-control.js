'use strict';

angular.module('estesWebApp').directive('typeaheadControl', function () {
    return {
      restrict: 'A',
      require: '^typeahead',
      link: function postLink(scope, element, attrs, controller) {
    	  var $input = element;
    	   
    	  $input.bind('focus', function() {
    		  scope.$apply(function() { controller.focused(true); controller.hide(false);});
    	  });
    	   
    	  $input.bind('blur', function() {
    		  scope.$apply(function() { controller.focused(false); });
    	  });
    	   
    	  $input.bind('keyup', function(e) {
    		  if (e.keyCode === 9 || e.keyCode === 13) {
    			  scope.$apply(function() { controller.selectActive(); });
    		  }
    	   
    		  if (e.keyCode === 27) {
    			  scope.$apply(function() { controller.hide(true); });
    		  }
    	  });
    	   
    	  $input.bind('keydown', function(e) {
    		  if (e.keyCode === 9 || e.keyCode === 13 || e.keyCode === 27) {
    			  e.preventDefault();
    		  }
    	   
    		  if (e.keyCode === 40) {
    			  e.preventDefault();
    			  scope.$apply(function() { controller.activateNextItem(); });
    		  }
    	   
    		  if (e.keyCode === 38) {
    			  e.preventDefault();
    			  scope.$apply(function() { controller.activatePreviousItem(); });
    		  }
    	  });
      }
    };
  });
