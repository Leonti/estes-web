'use strict';

angular.module('estesWebApp').directive('pikaday', function() {
	return {
		scope : {
			'date' : '=ngModel'
		},
		require : 'ngModel',
		link : function postLink(scope, element, attrs) {
			var options = {
				field : element[0],
				defaultDate : new Date()
			};
			angular.extend(options, attrs.pikaday ? scope.$parent.$eval(attrs.pikaday) : {});
			var onSelect = options.onSelect;
			options.onSelect = function(date) {
				scope.date = date;
				scope.$apply(scope.date);
				if (angular.isFunction(onSelect)) {
					onSelect();
				}
			};
			var picker = new Pikaday(options);
			scope.$on('$destroy', function() {
				picker.destroy();
			});
		}
	};
});
