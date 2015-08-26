(function() {
  'use strict';

  angular
    .module('company-insights')
    .config(config);

  /** @ngInject */
  function config($logProvider) {
    // Enable log
    $logProvider.debugEnabled(true);
  }

})();
