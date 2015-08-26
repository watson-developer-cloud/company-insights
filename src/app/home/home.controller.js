(function() {
  'use strict';

  angular
    .module('company-insights')
    .controller('HomeController', HomeController);

  /** @ngInject */
  function HomeController($state, $log) {

    this.goWatsonAPI = function(){
      $state.go('root.watson');
    };
  }
})();
