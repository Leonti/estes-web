'use strict';

describe('Service: Printer', function () {

  // load the service's module
  beforeEach(module('estesWebApp'));

  // instantiate service
  var Printer;
  beforeEach(inject(function (_Printer_) {
    Printer = _Printer_;
  }));

  it('should do something', function () {
    expect(!!Printer).toBe(true);
  });

});
