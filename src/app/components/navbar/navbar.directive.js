(function() {
  'use strict';

  angular
    .module('company-insights')
    .directive('navbar', navbar);

  /** @ngInject */
  function navbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      controller: NavbarController,
      controllerAs: 'navbarCtrl',
      bindToController: true,
      replace: true
    };

    return directive;

    /** @ngInject */
    function NavbarController() {

    }
  }

})();
