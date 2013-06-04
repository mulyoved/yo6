'use strict';

describe('Directive: TopToolbar', function () {
  beforeEach(module('yo6App'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<-top-toolbar></-top-toolbar>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the TopToolbar directive');
  }));
});
