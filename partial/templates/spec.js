'use strict';

describe('<%= ctrlname %>', function() {

  var $scope, createCtrl;

  beforeEach(module('<%= appname %>'));

  beforeEach(inject(function($rootScope, $controller) {
    $scope = $rootScope.$new();
    createCtrl = function() {
      return $controller('<%= ctrlname %>', {
        $scope: $scope
      });
    };
  }));

  it('should be defined', function() {
    var ctrl = createCtrl();
    expect(ctrl).toBeDefined();
  });
});
