'use strict';

describe('<%= _.camelize(name) %>', function() {

  beforeEach(module('<%= appname %>'));

  var $scope, $compile;

  beforeEach(inject(function($rootScope, _$compile_) {
    $scope = $rootScope.$new();
    $compile = _$compile_;
  }));

  it('should ...', function() {

    /*
    To test your directive, you need to create some html that would use your directive,
    send that through compile() then compare the results.

    var element = compile('<div mydirective name="name">hi</div>')(scope);
    expect(element.text()).toBe('hello, world');
    */
  });
});
