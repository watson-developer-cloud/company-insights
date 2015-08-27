(function() {
  'use strict';

  angular
    .module('company-insights')
    .controller('HomeController', HomeController);


  /** @ngInject */
  function HomeController(personalityInsight) {

    var _this = this;
    this.mainCompany = null;
    this.chartData = [];

    this.analyze = function(){
      personalityInsight
        .analyze(this.mainCompany)
        .then(function(data){
          _this.chartData = data;
        });
    };

  }
})();
