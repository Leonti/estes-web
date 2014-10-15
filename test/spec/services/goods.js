'use strict';

describe('Service: Goods', function () {

  // load the service's module
  beforeEach(module('estesWebApp'));

  // instantiate service
  var Goods;
  beforeEach(inject(function (_Goods_) {
    Goods = _Goods_;
  }));

  it('should do something', function () {
    expect(!!Goods).toBe(true);
  });

});
