'use strict';

describe('Directive: historyPicker', function () {

  // load the directive's module
  beforeEach(module('estesWebApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<history-picker></history-picker>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the historyPicker directive');
  }));
});
