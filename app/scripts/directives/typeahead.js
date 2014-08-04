'use strict';

angular.module('estesWebApp').directive('typeahead', function () {
    return {
      template: '<div ng-transclude></div>',
      restrict: 'A',
      transclude: true,
      scope: {
    	  onSelect: "&"
      },
      link: function postLink(scope, element, attrs) {
        // element.text('this is the typeahead directive');
    	
		  scope.$watch('term', function(term) {
			  console.log(term);
		  });  
      
      },
      controller: ["$scope", function($scope) {
    	  $scope.items = [];
    	  $scope.hide = false;
    	   
    	  this.activate = function(item) {
    		  $scope.active = item;
    	  };
    	   
    	  this.activateNextItem = function() {
    		  console.log('activating next item');
    		  console.log($scope.items);
    		  //var index = $scope.items.indexOf($scope.active);
    		  //this.activate($scope.items[(index + 1) % $scope.items.length]);
    	  };
    	   
    	  this.activatePreviousItem = function() {
    		  console.log('activating previous item');
    		 // var index = $scope.items.indexOf($scope.active);
    		 // this.activate($scope.items[index === 0 ? $scope.items.length - 1 : index - 1]);
    	  };
    	   
    	  this.isActive = function(item) {
    		  return $scope.active === item;
    	  };
    	   
    	  this.selectActive = function() {
    		  this.onSelect($scope.active);
    	  };
    	   
    	  this.select = function(item) {
	    	  $scope.hide = true;
	    	  $scope.focused = true;
	    	  console.log($scope.onSelect);
	    	  $scope.onSelect({item:item});
    	  };
    	   
    	  $scope.isVisible = function() {
    		  return !$scope.hide && ($scope.focused || $scope.mousedOver);
    	  };
    	   
    	  $scope.query = function() {
    		  $scope.hide = false;
    		  $scope.search({term:$scope.term});
    	  }
      }]      
    };
  });
