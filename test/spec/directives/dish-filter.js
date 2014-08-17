'use strict';

describe('Directive: dishFilter', function () {

  // load the directive's module
  beforeEach(module('estesWebApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<dish-filter></dish-filter>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the dishFilter directive');
  }));
});
