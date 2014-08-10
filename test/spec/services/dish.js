'use strict';

describe('Service: Dish', function () {

  // load the service's module
  beforeEach(module('estesWebApp'));

  // instantiate service
  var Dish;
  beforeEach(inject(function (_Dish_) {
    Dish = _Dish_;
  }));

  it('should do something', function () {
    expect(!!Dish).toBe(true);
  });

});
