'use strict';

describe('Directive: editable', function () {

  // load the directive's module
  beforeEach(module('estesWebApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<editable></editable>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the editable directive');
  }));
});
