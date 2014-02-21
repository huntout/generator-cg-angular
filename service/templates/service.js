'use strict';

angular.module('<%= appname %>').factory('<%= _.camelize(name) %>', function() {

  var <%= _.camelize(name) %> = {
    doSomething: function() {
      return 'something';
    }
  };

  return <%= _.camelize(name) %>;
});
