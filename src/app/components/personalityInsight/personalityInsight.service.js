(function () {
  'use strict';

  angular
    .module('company-insights')
    .factory('personalityInsight', personalityInsight);

  /** @ngInject */
  function personalityInsight($q, $http) {

    var service = {
      chartDataCache: {},
      chartData: {},
      categories: ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Emotional range'],
      analyze: function (companies, index, defer) {
        var deferred = defer || $q.defer();
        var pos = index || 0;
        if(pos === 0){
          this.chartData = {};
        }
        var _this = this;

        if(!angular.isUndefined(this.chartDataCache[companies[pos]])){
          this.chartData[companies[pos]] = this.chartDataCache[companies[pos]];
          if(pos >= companies.length-1){
            deferred.resolve(this.getChart());
          }else{
            this.analyze(companies, pos+1, deferred);
          }
        }else{
          $http
            .get('/api/personality_insights/' + companies[pos])
            .then(function (res) {
              _this.chartDataCache[companies[pos]] = res.data;
              _this.chartData[companies[pos]] = res.data;
              if(pos >= companies.length-1){
                deferred.resolve(_this.getChart());
              }else{
                _this.analyze(companies, pos+1, deferred);
              }
            })
            .catch(function (err) {
              deferred.reject(err);
            });
        }
        return deferred.promise;
      },

      getChart: function () {
        var result = [];
        var _this = this;

        this.categories.forEach(function(category) {
          angular.forEach(_this.chartData, function(data) {
            for (var j = 0; j < data.length; j++) {
              if (data[j].name === category) {
                result.push(Math.floor(data[j].value * 100));
              }
            }
          });
        });
        return result;
      }
    };


    return service;
  }
})();
