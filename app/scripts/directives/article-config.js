'use strict';
/*global _:false */

angular.module('estesWebApp').directive('articleConfig', [function() {
	return {
		templateUrl: '/views/directives/article-config.html',
		restrict: 'E',
		replace: true,
		scope: {
			inputArticle: '=article',
			onSave: '&',
			onCancel: '&'
		},
		link : function postLink(scope) {
			
			scope.selectedOptions = [];
			scope.$watch('inputArticle', function(article) {
				if (!article) { return; }

				scope.article = angular.copy(article);
				
				scope.selectedOptions = [];
				for (var i = 0; i < article.options.length; i++) {
					var optionOrs = article.options[i];
					var optionStates = [];
					for (var j = 0; j < optionOrs.length; j++) {
						
						if (article.selectedOptions[i]) {
							var state = optionOrs[j].name === article.selectedOptions[i].name;
							optionStates.push(state);
						} else {
							optionStates.push(j == 0);							
						}
					}
					
					scope.selectedOptions.push(optionStates);
				}
			});
			
			scope.$watch('selectedOptions', function(selectedOptions, oldSelectedOptions) {
				if (!oldSelectedOptions.length) { return; }
				
				function findChangedInRow(row, oldRow) {
					if (!oldRow) { return -1; }
					
					for (var i = 0; i < row.length; i++) {
						if (row[i] === true && oldRow[i] === false) {
							return i;
						}
					}
					return -1;
				}
				
				for (var i = 0; i < selectedOptions.length; i++) {
					
					var selectedOrs = selectedOptions[i];
					var oldSelectedOrs = oldSelectedOptions[i];
					var changedPosition = findChangedInRow(selectedOrs, oldSelectedOrs);
					if (changedPosition === -1) {
						continue;
					}
					
					for (var j = 0; j < selectedOrs.length; j++) {
						if (j !== changedPosition) {
							selectedOptions[i][j] = false;
						}
					}
				}
				
			}, true);
			
			scope.save = function(article) {
				
				article.selectedOptions = [];
				
				for (var i = 0; i < scope.selectedOptions.length; i++) {
					for (var j = 0; j < scope.selectedOptions[i].length; j++) {
						if (scope.selectedOptions[i][j]) {
							article.selectedOptions.push(article.options[i][j]);
						}
					}
				}
				
				// use 2-way binding to update the ui
				angular.extend(scope.inputArticle, article);
				scope.onSave({article: article});
			};
			
			scope.cancel = scope.onCancel;
		}
	};
}]);
