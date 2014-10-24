'use strict';

angular.module('estesWebApp').directive('articleFilter', function() {
	return {
		templateUrl: '/views/directives/article-filter.html',
		replace: true,
		restrict: 'E',
		scope: {
			tags: '=',
			selectedTags: '=',
			searchTerm: '=',
			taxGroups: '=',
			selectedTaxGroups: '='
		},
		link: function(scope) {
			
			scope.toTagLabel = function(tag) {
				return tag;
			}
			scope.tagId = scope.toTagLabel
			
			scope.toTaxGroupLabel = function(taxGroup) {
				return taxGroup.name + ' (' + taxGroup.tax + ' %)';
			}
			scope.taxGroupId = function(taxGroup) {
				if (!taxGroup) { return; }
				return taxGroup.id;
			}
			
		}
	};
});
