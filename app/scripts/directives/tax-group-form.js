'use strict';

angular.module('estesWebApp').directive('taxGroupForm', function() {
	return {
		templateUrl : '/views/directives/tax-group-form.html',
		replace: true,
		restrict : 'E',
		scope : {
			inputTaxGroup: '=taxGroup',
			onSave: '&',
			onCancel: '&'
		},
		link : function postLink(scope) {
			
			scope.$watch('inputTaxGroup', function(taxGroup) {
				if (!taxGroup) { return; }

				scope.taxGroup = angular.copy(taxGroup);
			});
			
			scope.save = function(taxGroup) {
				scope.onSave({taxGroup: angular.copy(taxGroup)});
				
				scope.taxGroup = {
					name: '',
					tax: ''
				};
				
				scope.taxGroupForm.$setPristine();
			};
			
			scope.cancel = scope.onCancel;			
		}
	};
});
