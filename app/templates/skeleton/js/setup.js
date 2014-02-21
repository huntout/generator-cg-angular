'use strict';

angular.module('<%= appname %>', [
  'mgcrea.ngStrap',
  'ui.utils',
  'ngRoute',
  'ngAnimate',
  'route-segment',
  'view-segment',
  'http-auth-interceptor'
]);

angular.module('<%= appname %>').config(function($routeSegmentProvider, $routeProvider) {

  $routeSegmentProvider.options.autoLoadTemplates = true;

  /* Add New Route Segments Above */

  $routeProvider.otherwise({
    redirectTo: '/'
  });
});

angular.module('<%= appname %>').run(function($rootScope) {

  $rootScope.safeApply = function(fn) {
    var phase = $rootScope.$$phase;
    if (phase === '$apply' || phase === '$digest') {
      if (fn && (typeof(fn) === 'function')) {
        fn();
      }
    } else {
      this.$apply(fn);
    }
  };
});
