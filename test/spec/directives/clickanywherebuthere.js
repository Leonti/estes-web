'use strict';

describe('Directive: clickAnywhereButHere', function () {

  // load the directive's module
  beforeEach(module('estesWebApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<click-anywhere-but-here></click-anywhere-but-here>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the clickAnywhereButHere directive');
  }));
});
