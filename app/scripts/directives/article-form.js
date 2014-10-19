'use strict';
/* global _:false */

angular.module('estesWebApp').directive('articleForm', function() {
	return {
		templateUrl : 'views/directives/article-form.html',
		restrict : 'EA',
		scope : {
			inputArticle : '=?article',
			tags : '=',
			options : '=',
			taxGroups : '=',
			onTaxGroupUpdateInput : '&onTaxGroupUpdate',
			onClose : '&',
			onSave : '&'
		},
		link : function postLink(scope) {

			scope.expandedRow = null;
			scope.addingOption = false;
			
			scope.$watch('inputArticle', function(article) {
				if (!article) {
					return;
				}

				scope.article = angular.copy(article);
			});

			scope.expandRow = function(row) {
				scope.expandedRow = row;
			};
			
			scope.showAddOption = function() {
				scope.addingOption = true;
			};

			scope.hideAddOption = function() {
				scope.addingOption = false;
			};			
			
			scope.addOptionToArticle = function(option) {
				scope.article.options.push([ option ]);
				scope.hideAddOption();
			};

			scope.orOptionToArticle = function(option, index) {
				scope.article.options[index].push(option);
				scope.expandedRow = null;
			}

			scope.removeOption = function(optionRow, optionCol) {
				if (scope.article.options[optionRow].length === 1) {
					scope.article.options.splice(optionRow, 1);
				} else {
					scope.article.options[optionRow].splice(optionCol, 1);
				}
			};

			scope.orOptionToArticleCancel = function() {
				scope.expandedRow = null;
			}

			scope.save = function(article) {
				scope.onSave({
					article : article
				});
			};

			scope.cancel = function() {
				scope.onClose();
			};
			
			scope.onTaxGroupUpdate = function(taxGroup) {
				scope.onTaxGroupUpdateInput({ taxGroup: taxGroup });
			};

		}
	};
});
