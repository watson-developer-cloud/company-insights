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
      .state('root.watson', {
        url: '/watson',
        templateUrl: 'app/watson/watson.html',
        controller: 'WatsonController',
        controllerAs: 'watsonCtrl'
      });

    $urlRouterProvider.otherwise('/root/home');
  }

})();
