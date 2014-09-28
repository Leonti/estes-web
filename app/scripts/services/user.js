'use strict';

angular.module('estesWebApp').factory('User', [ '$q', '$location', '$cookies', '$http', function User($q, $location, $cookies, $http) {

	function User($q, $cookies) {
		
		function getUserSession() {
			if (!$cookies.userSession_id) {
				return null;
			}
			
			return {
				id : $cookies.userSession_id,
				userId: $cookies.userSession_userId
			};			
		}
		
		return {
			
			saveUserSession : function(userSession) {
				$cookies.userSession_id = userSession.id;
				$cookies.userSession_userId = userSession.userId;
			}, 
			
			getUserSession : getUserSession,
			
			destroyUserSession : function() {
				console.log('Destroying user session');
				
				delete $cookies.userSession_userId;
				delete $cookies.userSession_id;
				
				
				
				return $q.when();
				// do a call to backend here
			},
			
			checkAndRedirect : function() {
				
				if (getUserSession() === null) {
					$location.url('/login');
				}
			}
		}
	}

	return new User($q, $cookies);
} ]);
