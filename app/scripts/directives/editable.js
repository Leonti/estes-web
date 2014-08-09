'use strict';

/**
 * @ngdoc directive
 * @name estesWebApp.directive:editable
 * @description
 * # editable
 */
angular.module('estesWebApp')
  .directive('editable', function ($timeout) {
    return {
      template: '<span ng-hide="editing" ng-click="start()">{{value}}</span>\
    	  <input ng-show="editing" ng-blur="finish()" type="text" class="form-control dish-name" \
    	  placeholder="{{placeholder}}" ng-model="value">',
      restrict: 'E',
      scope: {
    	  value: '=',
    	  placeholder: '@'
      },
      link: function postLink(scope, element, attrs) {
    	  scope.editing = false;
    	  scope.start = function() {
    		  scope.editing = true;
    		  $timeout(function() {
    			  element.find('input').focus();
    		  }, 100);
    	  }
    	  scope.finish = function() {
    		  scope.editing = false;
    	  }
      }
    };
  });
