'use strict';

describe('Service: eventStorage', function () {

  // load the service's module
  beforeEach(module('yo6App'));

  // instantiate service
  var eventStorage;
  beforeEach(inject(function (_eventStorage_) {
    eventStorage = _eventStorage_;
  }));

  it('should do something', function () {
    expect(!!eventStorage).toBe(true);
  });

});
