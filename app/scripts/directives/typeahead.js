'use strict';

angular.module('estesWebApp').directive('typeahead', function () {
    return {
      template: '<div ng-transclude></div>',
      restrict: 'A',
      transclude: true,
      scope: {
    	  onSelect: '&',
    	  items: '='
      },
      controller: ['$scope', function($scope) {
    	  $scope.hide = false;
    	  
    	  this.activate = function(item) {
    		  $scope.active = item;
    	  };
    	   
    	  this.activateNextItem = function() {
    		  var index = $scope.items.indexOf($scope.active);
    		  this.activate($scope.items[(index + 1) % $scope.items.length]);
    	  };
    	   
    	  this.activatePreviousItem = function() {
    		  var index = $scope.items.indexOf($scope.active);
    		  this.activate($scope.items[index === 0 ? $scope.items.length - 1 : index - 1]);
    	  };
    	   
    	  this.isActive = function(item) {
    		  return $scope.active === item;
    	  };
    	   
    	  this.selectActive = function() {
    		  this.select($scope.active);
    	  };
    	   
    	  this.select = function(item) {
	    	  $scope.hide = true;
	    	  $scope.focused = true;
	    	  $scope.onSelect({item:item});
    	  };
    	  
    	  this.hide = function(hide) {
    		  $scope.hide = hide;
    	  };
    	  
    	  this.focused = function(focused) {
    		  $scope.focused = focused;
    	  };
    	  
    	  this.mousedOver = function(mousedOver) {
    		  $scope.mousedOver = mousedOver;
    	  };
    	  
    	  $scope.$parent.isVisible = function() {
    		  return !$scope.hide && ($scope.focused || $scope.mousedOver) && $scope.items.length > 0;
    	  };
    	  
      }]      
    };
  });
