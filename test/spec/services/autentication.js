'use strict';

describe('Service: autentication', function () {

  // load the service's module
  beforeEach(module('yo6App'));

  // instantiate service
  var autentication;
  beforeEach(inject(function (_autentication_) {
    autentication = _autentication_;
  }));

  it('should do something', function () {
    expect(!!autentication).toBe(true);
  });

});
