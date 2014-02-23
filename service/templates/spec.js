'use strict';

describe('<%= classname %>', function() {

  beforeEach(module('<%= appname %>'));

  it('should ...', inject(function(<%= classname %>) {

    expect(<%= classname %>.doSomething()).toEqual('something');
  }));
});
