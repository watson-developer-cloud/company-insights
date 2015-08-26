(function() {
  'use strict';

  angular
    .module('company-insights')
    .controller('HomeController', HomeController);


  /** @ngInject */
  function HomeController($log) {
    this.data = [10,20,30,40,60, 80, 20, 50];
  }
})();
