(function() {
  'use strict';

  angular
    .module('company-insights')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
