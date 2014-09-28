'use strict';

angular.module('estesWebApp').service('Rest', [ 'Config', 'Restangular', 'User', function Rest(Config, Restangular, User) {

	return {
		configure: function() {
			return Config.get().then(function(config) {
				var userSession = User.getUserSession();
				Restangular.setDefaultRequestParams({api_key: userSession.id});
				Restangular.setBaseUrl(config.backendBaseUrl + '/rest/user/' + userSession.userId);
			});
		}
	};
	
}]);
