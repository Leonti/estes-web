'use strict';

angular.module('estesWebApp').directive('tags', function () {
    return {
      templateUrl: 'views/directives/tags.html',
      replace: true,
      restrict: 'E',
      scope: {
    	  availableTagsInput: '=availableTags',
    	  selectedTags: '=',
    	  tagName: '@'
      },
      link: function postLink(scope) {
    	  scope.newTag = '';
    	  scope.selecting = false;
  
    	  scope.$watch('availableTagsInput', function(availableTagsInput) {
    		  if (!availableTagsInput) { return; }
				
    		  scope.availableTags = angular.copy(availableTagsInput);
    	  });    	  
    	  
    	  scope.toggleSelecting = function() {
    		  scope.selecting = !scope.selecting;
    	  };
    	  
    	  scope.isAddActive = function() {
    		  return scope.newTag.length > 0;
    	  };
    	  
    	  scope.selectTag = function(tag) {
    		  if (scope.selectedTags.indexOf(tag) === -1) {
    			  scope.selectedTags.push(tag);
    		  }
    		  scope.selecting = false;
    	  };
    	  
    	  scope.addTag = function(tag) {
    		  if (scope.availableTags.indexOf(tag) === -1) {
    			  scope.availableTags.push(tag);
    		  }
    		  scope.selectTag(tag);
    		  scope.newTag = '';
    	  };
    	  
    	  scope.removeTag = function(tag) {
    		  scope.selectedTags.splice(scope.selectedTags.indexOf(tag), 1);   		  
    	  };
      }
    };
  });
