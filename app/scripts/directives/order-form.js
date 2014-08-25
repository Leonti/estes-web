'use strict';

angular.module('estesWebApp').directive('orderForm', function() {
	return {
		templateUrl : 'views/directives/order-form.html',
		replace: true,
		restrict : 'E',
		link : function postLink(scope, element, attrs) {
		}
	};
});
