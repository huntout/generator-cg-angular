'use strict';

angular.module('<%= appname %>', [
  'ngAnimate',
  'ngSanitize',
  'ngRoute',
  'route-segment',
  'view-segment',
  'ui.bootstrap',
  'ui.utils',
  'http-auth-interceptor'
])

.config(function($routeSegmentProvider, $routeProvider) {

  $routeSegmentProvider.options.autoLoadTemplates = true;

  /* Add New Route Segments Above */

  $routeProvider.otherwise({
    redirectTo: '/'
  });
})

.run(function($rootScope) {

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
