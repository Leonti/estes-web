'use strict';

describe('Controller: MenuEditorCtrl', function () {

  // load the controller's module
  beforeEach(module('estesWebApp'));

  var MenuEditorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MenuEditorCtrl = $controller('MenuEditorCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
