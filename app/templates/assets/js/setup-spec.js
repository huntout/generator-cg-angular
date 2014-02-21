'use strict';
/* globals _ */

describe('setup', function() {

  beforeEach(module('<%= appname %>'));

  describe('safeApply', function() {

    var $scope;

    beforeEach(inject(function($rootScope) {
      $scope = $rootScope.$new();
    }));

    _.each([{
      inside: '$apply',
      wrapper: '$apply',
      throwError: 'throw error'
    }, {
      inside: '$apply',
      wrapper: 'safeApply',
      throwError: 'throw error'
    }, {
      inside: 'safeApply',
      wrapper: '$apply',
      throwError: 'be safe'
    }, {
      inside: 'safeApply',
      wrapper: 'safeApply',
      throwError: 'be safe'
    }], function(n) {

      it(_.template('should <%%= throwError %> when <%%= inside %> in <%%= wrapper %>', n), function() {
        var ex = expect(function() {
          $scope[n.wrapper](function() {
            $scope[n.inside]();
          });
        });
        if (n.throwError === 'throw error') {
          ex.toThrowError(/\$apply already in progress/);
        } else {
          ex.not.toThrowError();
        }
      });
    });
  });
});
