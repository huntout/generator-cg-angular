'use strict';

describe('<%= ctrlname %>', function() {

  beforeEach(module('<%= appname %>'));

  var $scope;

  beforeEach(inject(function($rootScope, $controller) {
    $scope = $rootScope.$new();
    $controller('<%= ctrlname %>', {
      $scope: $scope
    });
  }));

  it('should ...', inject(function() {
    expect(1).toEqual(1);
  }));
});
