'use strict';

var app = angular.module('yo6App', ['ui.bootstrap','infinite-scroll'])
.config(function ($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'views/main.html',
		controller: 'MainCtrl'
	})
	.when('/event/:eid', {
		templateUrl: 'views/event.html',
		controller: 'EventDetailController'
	})
	.when('/tlogin', {
		templateUrl: 'views/tlogin.html',
		controller: 'MainCtrl'
	})
	.otherwise({
		redirectTo: '/'
	});
});

app.run(function ($rootScope, autentication) {
	console.log('app.run');

	var isProduction = '/* @echo NODE_ENV */' === 'production';
	console.log('isProduction = [%s] [%s]', isProduction, '/* @echo NODE_ENV */');

	if (isProduction) {
		$rootScope.config = {
			brand: 'Evnt7x24',
			debugMode: false,
			useMockup: false,
			facebookAppId: '181343322031434'
		};
	}
	else {
		$rootScope.config = {
			brand: 'Evnt7x24',
			debugMode: false,
			useMockup: true,
			facebookAppId: '193911810758167'
		};
	}

	//I don't understand why the toolbar.html template cannot access config.brand
	$rootScope.brand = $rootScope.config.brand;
	if ($rootScope.config.debugMode) {
		$rootScope.isLoggedin = true;
	}

	autentication.init();
});
