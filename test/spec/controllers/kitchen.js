'use strict';

describe('Controller: KitchenCtrl', function () {

  // load the controller's module
  beforeEach(module('estesWebApp'));

  var KitchenCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    KitchenCtrl = $controller('KitchenCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
