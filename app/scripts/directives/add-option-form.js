'use strict';

angular.module('estesWebApp').directive('addOptionForm', ['Article', function(Article) {
	
	var OptionTemplate = function() {
		return {
			id: Article.generateId(),
			name: '',
			priceChange: '0'
		}
	};
	
	return {
		templateUrl: '/views/directives/add-option-form.html',
		restrict: 'E',
		scope: {
			options: '=',
			onClose: '&',
			onSave: '&'
		},
		link: function postLink(scope, element, attrs) {
			
			scope.option = new OptionTemplate();
			
			scope.$watch('options', function(options) {
				if (!options) { return; }
				
				scope.typeaheadItems = options;
				scope.filteredOptions = angular.copy(scope.typeaheadItems);
			});
			
			scope.onTypeaheadSelect = function(option) {
				scope.option = angular.copy(option);
			};
			
			scope.filterOptions = function(options, term) {
				scope.filteredOptions = filter(options, term);
			};
			
			function filter(options, term) {
				if (!term) { return options; }
				return _.filter(options, function(option) { 
					return option.name.toUpperCase().indexOf(term.toUpperCase()) === 0;
				});
			}			
			
			scope.save = function(option) {
				scope.onSave({option: option});
				scope.option = new OptionTemplate();
			}
			
			scope.cancel = function() {
				scope.onClose();
				scope.option = new OptionTemplate();
			}
		}
	};
}]);
