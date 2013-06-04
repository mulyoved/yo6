'use strict';

  	console.log('TopToolbar 1.0');

angular.module('yo6App')
  .directive('toptoolbar', function () {
  	console.log('TopToolbar inside directive');
    return {
      	restrict: 'A',
      	templateUrl: 'views/includes/toolbar.html',
      	scope: {
      		brand: "@",
      		username: "@"
      	},
      	controller: function TopToolbarControler($scope, eventsFilterParams) {
      		$scope.isCollapsed = false;
      		$scope.filterValues = eventsFilterParams.getValues();

    		$scope.setEventsTime = function (time) {
		        console.log('setEventsTime, ' + time);
		        //$scope.time = time;
				$scope.filterValues.time = time;		        
				eventsFilterParams.setValues($scope.filterValues);
    		}
      	}
    };
});
