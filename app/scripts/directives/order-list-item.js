'use strict';

angular.module('estesWebApp').directive('orderListItem', ['Order', function(Order) {

	function caclulateOffset(elm) {
		try {
			return elm.offset();
		} catch (e) {
		}
		var rawDom = elm[0];
		var _x = 0;
		var _y = 0;
		var body = document.documentElement || document.body;
		var scrollX = window.pageXOffset || body.scrollLeft;
		var scrollY = window.pageYOffset || body.scrollTop;
		_x = rawDom.getBoundingClientRect().left + scrollX;
		_y = rawDom.getBoundingClientRect().top + scrollY;
		return {
			left : _x,
			top : _y
		};
	}	
	
	return {
		templateUrl : '/views/directives/order-list-item.html',
		replace: true,
		restrict : 'E',
		scope : {
			order: '=',
			onEdit: '&'
		},
		link : function postLink(scope, element, attrs) {
		
			scope.$watch('order', function(order) {
				scope.totalPrice = Order.calculateTotal(order);
			}, true);
			
			scope.onOrderClick = function(order) {
				scope.onEdit({order: order, offset: caclulateOffset(element)});
			}
		}
	};
}]);
