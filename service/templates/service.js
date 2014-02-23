'use strict';

angular.module('<%= appname %>').factory('<%= classname %>', function() {

  var <%= classname %> = {
    doSomething: function() {
      return 'something';
    }
  };

  return <%= classname %>;
});
