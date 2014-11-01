'use strict';

describe('Service: Httpmocks', function () {

  // load the service's module
  beforeEach(module('estesWebApp'));

  // instantiate service
  var Httpmocks;
  beforeEach(inject(function (_Httpmocks_) {
    Httpmocks = _Httpmocks_;
  }));

  it('should do something', function () {
    expect(!!Httpmocks).toBe(true);
  });

});
