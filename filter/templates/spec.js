'use strict';

describe('<%= camelname %>', function() {

  beforeEach(module('<%= appname %>'));

  it('should ...', inject(function($filter) {

    var filter = $filter('<%= camelname %>');

    expect(filter('input')).toEqual('output');
  }));
});
