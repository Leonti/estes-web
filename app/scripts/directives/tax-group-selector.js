'use strict';

angular.module('estesWebApp').directive('taxGroupSelector', ['Article', function(Article) {
	return {
		templateUrl : '/views/directives/tax-group-selector.html',
		restrict : 'E',
		scope : {
			taxGroups: '=',
			selectedTaxGroup: '='
		},
		link : function postLink(scope, element, attrs) {
			
			scope.indexInEditing = null;
			
			scope.taxGroup = {
				name: '',
				tax: ''
			};
			
			scope.addTaxGroup = function(taxGroup) {
				scope.taxGroups.push(taxGroup);
				scope.selectedTaxGroup = taxGroup;
			}
			
			scope.saveTaxGroup = function(taxGroup, index) {
				
				var oldTaxGroup = scope.taxGroups[index];
				
				scope.taxGroups[index] = taxGroup;
				scope.indexInEditing = null;
				
				if (oldTaxGroup.name === scope.selectedTaxGroup.name) {
					scope.selectedTaxGroup = taxGroup;
				}
			}
			
			scope.startEditing = function(index) {
				scope.indexInEditing = index;
			}
			
		}
	};
}]);
