'use strict';

describe('<%= classname %>', function() {

  var <%= classname %>;

  beforeEach(module('<%= appname %>'));

  beforeEach(inject(function(_<%= classname %>_) {
    <%= classname %> = _<%= classname %>_;
  }));

  it('should be defined', function() {
    expect(<%= classname %>).toBeDefined();
  });
});
