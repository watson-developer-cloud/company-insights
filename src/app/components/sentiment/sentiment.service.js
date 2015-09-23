(function () {
  'use strict';

  angular
    .module('company-insights')
    .factory('sentiment', sentiment);

  /** @ngInject */
  function sentiment($q, $http) {

    var service = {
      chartDataCache: {},
      chartData: {},
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
            .get('/api/mentions_sentiment/' + companies[pos])
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
          angular.forEach(_this.chartData, function(data) {
            result.push( Math.round((data.score/2 + 0.5) * 100) ); // map it from a -1 to 1 scale to a 0 to 100 scale.
          });
        return result;
      }
    };


    return service;
  }
})();
