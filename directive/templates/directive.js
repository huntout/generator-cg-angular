'use strict';

angular.module('<%= appname %>').directive('<%= camelname %>', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {

    },
    templateUrl: 'directive/<%= slugname %>/<%= slugname %>.html',
    link: function( /*scope, element, attrs, fn*/ ) {

    }
  };
});
