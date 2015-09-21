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
      })
      .state('root.tos', {
        url: '/tos',
        templateUrl: 'app/tos/tos.html',
        controller: 'TosController',
        controllerAs: 'tosCtrl'
      });

    $urlRouterProvider.otherwise('/root/home');
  }

})();
