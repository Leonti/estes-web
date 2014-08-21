'use strict';

describe('Directive: orderDishListItem', function () {

  // load the directive's module
  beforeEach(module('estesWebApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<order-dish-list-item></order-dish-list-item>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the orderDishListItem directive');
  }));
});
