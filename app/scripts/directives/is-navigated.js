'use strict';

angular.module('estesWebApp').directive('isNavigated', ['$rootScope', '$location', function($rootScope, $location) {
	return {
		restrict : 'A',
		link : function postLink(scope, element, attrs) {
			
			var url = null;

			function checkStatus() {
                if ($location.url().indexOf(url.replace('#', '')) !== -1) {
                	angular.element(element).addClass('active');
                } else {
                	angular.element(element).removeClass('active');
                }
			}
			
			$rootScope.$on('$locationChangeSuccess', function(event, newUrl, oldUrl) {
				if (url) {
					checkStatus();
				}
			});			
			
            attrs.$observe('href', function(href) {
                url = href;
                checkStatus();
            });
		}
	};
}]);
