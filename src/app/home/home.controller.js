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

    this.companyToCompare = null;
    this.companiesToCompare = [];

    this.existCompany = false;
    this.invalidCompany = false;
    this.limitExceeded = false;

    this.analyze = function(){
      personalityInsight
        .analyze(this.mainCompany)
        .then(function(data){
          _this.chartData = data;
        });
    };

    this.addCompanyToCompare = function(){
      if (this.companiesToCompare.length == 7) {
        this.limitExceeded = true;
      } 
      else if (this.companyToCompare == null || this.companyToCompare == "") {
        this.invalidCompany = true;
      }
      else if (this.companiesToCompare.indexOf(this.companyToCompare) > -1) {
        this.existCompany = true;
      } 
      else{
        this.companiesToCompare.push(this.companyToCompare);
        this.companyToCompare = null;
      };
      
    };

    this.validateCompany = function(){

      this.existCompany = false;
      this.invalidCompany = false;
      this.limitExceeded = false;

      if (this.companiesToCompare.length == 7) {
        this.limitExceeded = true;
      } 
      else if (this.companyToCompare == null || this.companyToCompare == "") {
        this.invalidCompany = true;
      }
      else if (this.companiesToCompare.indexOf(this.companyToCompare) > -1) {
        this.existCompany = true;
      };
      
    };
  }
})();
