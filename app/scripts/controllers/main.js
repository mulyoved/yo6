'use strict';

var app = angular.module('yo6App');

app.controller('MainCtrl', function (Facebook, $scope, $rootScope, $location, autentication) {
	console.log('MainCtrl');

	$scope.awesomeThings = [
	  'HTML5 Boilerplate',
	  'AngularJS',
	  'Karma'
	];
	
	$scope.autentication = autentication;
})
.controller('EventsController', function($scope, $rootScope, eventStorage) {
	console.log('EventsController');
	$scope.eventStorage = eventStorage;

	$rootScope.$on('eventsFilterParams.values', function (event, args) {
		console.log('eventsFilterParams.values');
		
		eventStorage.setFilter(args.values);
		eventStorage.loadNextPage();
	});
});

app.controller('EventDetailController', function($scope, $routeParams, eventStorage) {
	$scope.event = eventStorage.get($routeParams.eid);
});
