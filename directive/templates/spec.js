'use strict';

describe('<%= camelname %>', function() {

  var $scope, createElement;

  beforeEach(module('<%= appname %>'));

  beforeEach(inject(function($rootScope, $compile) {
    $scope = $rootScope.$new();
    createElement = function() {
      return $compile('<div <%= camelname %>></div>')($scope);
    };
  }));

  it('should be defined', function() {
    var element = createElement();
    expect(element).toBeDefined();
  });
});
