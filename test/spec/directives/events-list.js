'use strict';

describe('Directive: eventsList', function () {

  // load the directive's module
  beforeEach(module('estesWebApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<events-list></events-list>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the eventsList directive');
  }));
});
