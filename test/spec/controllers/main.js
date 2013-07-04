'use strict';

describe('Controller: MainCtrl', function () {

	// load the controller's module
	//, ['ui.bootstrap','infinite-scroll'])
	beforeEach(module('yo6App'));

	var MainCtrl;
	var scope;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope) {
		scope = $rootScope.$new();
		MainCtrl = $controller('MainCtrl', {
		$scope: scope
		});
	}));

	it('should attach autentication', function () {
		expect(!!scope.autentication).toBe(true);
	});

	it('should attach autentication.logout', function () {
		expect(!!scope.autentication.logout).toBe(true);
	});
});
