'use strict';

describe('<%= camelname %>', function() {

  var $filter, filter;

  beforeEach(module('<%= appname %>'));

  beforeEach(inject(function(_$filter_, <%= camelname %>Filter) {
    $filter = _$filter_;
    filter = <%= camelname %>Filter;
  }));

  it('should be defined', function() {
    expect(filter).toBeDefined();
    expect(filter).toBe($filter('<%= camelname %>'));
  });
});
