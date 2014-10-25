'use strict';

angular.module('estesWebApp').directive('taxGroupSelector', ['Article', function(Article) {
	return {
		templateUrl : '/views/directives/tax-group-selector.html',
		restrict : 'E',
		scope : {
			taxGroups: '=',
			selectedTaxGroup: '=',
			leftAlign: '=',
			onUpdate: '&'
		},
		link : function postLink(scope, element, attrs) {
			
			scope.indexInEditing = null;
			scope.dropdownOpened = false;
			
			scope.taxGroup = {
				name: '',
				tax: ''
			};
			
			scope.add = function(taxGroup) {
				taxGroup.id = Article.generateId();
				scope.taxGroups.push(taxGroup);
				scope.selectedTaxGroup = taxGroup;
			}
			
			scope.update = function(taxGroup, index) {
				
				var oldTaxGroup = scope.taxGroups[index];
				
				scope.taxGroups[index] = taxGroup;
				scope.indexInEditing = null;
				
				if (scope.selectedTaxGroup.id === taxGroup.id) {
					scope.selectedTaxGroup = taxGroup;
				}
				
				console.log(taxGroup);
				
				scope.onUpdate({ taxGroup: taxGroup });
			}
			
			scope.startEditing = function(index) {
				scope.indexInEditing = index;
			}
			
			scope.toggleDropdown = function() {
				scope.dropdownOpened = !scope.dropdownOpened;
			}
			
			scope.selectTaxGroup = function(taxGroup) {
				scope.selectedTaxGroup = taxGroup;
				scope.dropdownOpened = false;
			}
			
		}
	};
}]);
