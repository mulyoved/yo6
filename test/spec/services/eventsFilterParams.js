'use strict';

describe('Service: eventsFilterParams', function () {

  // load the service's module
  beforeEach(module('yo6App'));

  // instantiate service
  var eventsFilterParams;
  beforeEach(inject(function (_eventsFilterParams_) {
    eventsFilterParams = _eventsFilterParams_;
  }));

  it('should do something', function () {
    expect(!!eventsFilterParams).toBe(true);
  });

});
