'use strict';

describe('Service: Demo', function () {

  // load the service's module
  beforeEach(module('estesWebApp'));

  // instantiate service
  var Demo;
  beforeEach(inject(function (_Demo_) {
    Demo = _Demo_;
  }));

  it('should do something', function () {
    expect(!!Demo).toBe(true);
  });

});
