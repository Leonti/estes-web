'use strict';

angular.module('estesWebApp').directive('historyPicker', function() {
	return {
		templateUrl : '/views/directives/history-picker.html',
		restrict : 'E',
		scope : {
			dateStart: '=',
			dateEnd: '='
		},
		link : function postLink(scope, element, attrs) {
			
			scope.ranges = {
				date: {
					dateEnd: new Date()
				},
				range: {
					dateEnd: new Date(),
					dateStart: new Date()										
				}
			};
			
			scope.$watch('ranges.date.dateEnd', function(dateEnd) {

				if (scope.selectedType === 'DATE') {
					updateDates(moment(dateEnd).startOf('day'), moment(dateEnd).endOf('day'));
				}
			}); 

			scope.$watch('ranges.range.dateEnd', function(dateEnd) {
				if (scope.selectedType === 'RANGE') {
					updateDates(moment(scope.ranges.range.dateStart).startOf('day'), moment(dateEnd).endOf('day'));
				}
			});			

			scope.$watch('ranges.range.dateStart', function(dateStart) {
				if (scope.selectedType === 'RANGE') {
					updateDates(moment(dateStart).startOf('day'), moment(scope.ranges.range.dateEnd).endOf('day'));
				}
			});			

			function updateDates(dateStart, dateEnd) {
				scope.dateStart = dateStart;
				scope.dateEnd = dateEnd;				
			}
			
			scope.todaySelected = function() {
				scope.selectedType = 'TODAY';
				updateDates(moment().startOf('day'), moment().endOf('day'));
			}
			
			scope.dateSelected = function() {
				scope.selectedType = 'DATE';
				updateDates(moment(scope.ranges.date.dateEnd).startOf('day'), moment(scope.ranges.date.dateEnd).endOf('day'));
			}
			
			scope.rangeSelected = function() {
				scope.selectedType = 'RANGE';
				updateDates(moment(scope.ranges.range.dateStart).startOf('day'), moment(scope.ranges.range.dateEnd).endOf('day'));
			}
			
			scope.todaySelected();
			
			scope.formatDate = function(date) {
				return moment(date).format('L');
			};
		}
	};
});
