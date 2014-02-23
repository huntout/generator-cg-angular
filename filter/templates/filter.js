'use strict';

angular.module('<%= appname %>').filter('<%= camelname %>', function() {
  return function( /*input, arg*/ ) {
    return 'output';
  };
});
