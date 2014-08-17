'use strict';

describe('Service: Waiter', function () {

  // load the service's module
  beforeEach(module('estesWebApp'));

  // instantiate service
  var Waiter;
  beforeEach(inject(function (_Waiter_) {
    Waiter = _Waiter_;
  }));

  it('should do something', function () {
    expect(!!Waiter).toBe(true);
  });

});
