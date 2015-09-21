(function() {
  'use strict';

  angular
    .module('company-insights')
    .controller('HomeController', HomeController);


  /** @ngInject */
  function HomeController($log, personalityInsight, news, sentiment) {

    var _this = this;
    this.mainCompany = null;
    this.chartData = [];
    this.news = [];
    this.sentiment = null;

    this.loading = {
      news: false,
      chart: false,
      sentiment: false
    };

    this.companyToCompare = null;
    this.companiesToCompare = [];

    this.existCompany = false;
    this.invalidCompany = false;
    this.limitExceeded = false;

    this.getNews = function(){
      this.loading.news = true;
      news
        .get(this.mainCompany)
        .then(function(data){
          _this.loading.news = false;
          _this.news = data;
        })
        .catch(function(e) {
          $log.error('Error loading news', e);
          _this.loading.news = false;
        });
    };

    this.getSentiment = function(){
      this.loading.sentiment = true;
      sentiment
        .get(this.mainCompany)
        .then(function(data){
          _this.loading.sentiment = false;
          _this.sentiment = data;
          _this.sentiment.chartData = [
            Math.round((_this.sentiment.score/2 + 0.5) * 100) // map it from a -1 to 1 scale to a 0 to 100 scale.
          ]
        })
        .catch(function(e) {
          $log.error('Error loading sentiment', e);
          _this.loading.sentiment = false;
        });
    };


    this.analyze = function(){
      this.loading.chart = true;
      var companies = [];

      // force it to begin with an @ symbol (for both aesthetics and caching)
      if (this.mainCompany[0]  !== '@') {
        this.mainCompany = '@' + this.mainCompany;
      }

      companies.push(this.mainCompany);
      companies = companies.concat(this.companiesToCompare);

      personalityInsight
        .analyze(companies)
        .then(function(data){
          _this.loading.chart = false;
          _this.chartData = data;
        })
        .catch(function(e) {
          $log.error('Error loading personality insights', e);
          _this.loading.chart = false;
        });

      this.getNews();
      this.getSentiment();
    };

    this.addCompanyToCompare = function(){
      if (this.companiesToCompare.length == 7) {
        this.limitExceeded = true;
        return;
      }
      if (!this.companyToCompare) {
        this.invalidCompany = true;
        return;
      }

      // force it to begin with an @ symbol (for both aesthetics and caching)
      if (this.companyToCompare[0]  !== '@') {
        this.companyToCompare = '@' + this.companyToCompare;
      }

      if (this.companiesToCompare.indexOf(this.companyToCompare) > -1) {
        this.existCompany = true;
      }
      else{
        this.companiesToCompare.push(this.companyToCompare);
        this.companyToCompare = null;
      }

    };

    this.validateCompany = function(){

      this.existCompany = false;
      this.invalidCompany = false;
      this.limitExceeded = false;

      if (this.companiesToCompare.length == 7) {
        this.limitExceeded = true;
      }
      else if (!this.companyToCompare) {
        this.invalidCompany = true;
      }
      else if (this.companiesToCompare.indexOf(this.companyToCompare) > -1) {
        this.existCompany = true;
      }

    };
  }
})();
