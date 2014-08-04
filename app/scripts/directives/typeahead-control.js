'use strict';

angular.module('estesWebApp').directive('typeaheadControl', function () {
    return {
      restrict: 'A',
      require: '^typeahead',
      link: function postLink(scope, element, attrs, controller) {
    	  var $input = element;
    	   
    	  $input.bind('focus', function() {
    		  scope.$apply(function() { scope.focused = true; });
    	  });
    	   
    	  $input.bind('blur', function() {
    		  scope.$apply(function() { scope.focused = false; });
    	  });
    	   
//    	  $list.bind('mouseover', function() {
//    		  scope.$apply(function() { scope.mousedOver = true; });
//    	  });
//    	   
//    	  $list.bind('mouseleave', function() {
//    		  scope.$apply(function() { scope.mousedOver = false; });
//    	  });
    	   
    	  $input.bind('keyup', function(e) {
    		  if (e.keyCode === 9 || e.keyCode === 13) {
    			  scope.$apply(function() { controller.selectActive(); });
    		  }
    	   
    		  if (e.keyCode === 27) {
    			  scope.$apply(function() { scope.hide = true; });
    		  }
    	  });
    	   
    	  $input.bind('keydown', function(e) {
    		  if (e.keyCode === 9 || e.keyCode === 13 || e.keyCode === 27) {
    			  e.preventDefault();
    		  };
    	   
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
