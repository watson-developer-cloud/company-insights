(function() {
  'use strict';

  angular
    .module('company-insights')
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('root', {
        url: '/root',
        abstract: true,
        controller: 'RootController',
        templateUrl: 'app/root/root.html'
      })
      .state('root.home', {
        url: '/home',
        templateUrl: 'app/home/home.html',
        controller: 'HomeController',
        controllerAs: 'homeCtrl'
      });

    $urlRouterProvider.otherwise('/root/home');
  }

})();
