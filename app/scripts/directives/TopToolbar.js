'use strict';

console.log('TopToolbar 1.0');

angular.module('yo6App')
.directive('toptoolbar', function () {
	console.log('TopToolbar inside directive');

	return {
		restrict: 'A',
		templateUrl: 'views/includes/toolbar.html',
		scope: {
			brand: '@',
			username: '@'
		},
		controller: function TopToolbarControler($scope, $rootScope, eventsFilterParams, autentication) {
			$scope.isCollapsed = false;
			$scope.eventsFilterParams = eventsFilterParams;
			$scope.autentication = autentication;

			$scope.setEventsTime = function (time) {
				console.log('setEventsTime, ' + time);
				eventsFilterParams.values.time = time;
				$rootScope.$broadcast('eventsFilterParams.values', { values: eventsFilterParams.values});
			};
		}
	};
});
